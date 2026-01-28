const path = require('path');
const fs = require('fs').promises;
const { spawn } = require('child_process');
const { pathToFileURL } = require('url');
const xlsx = require('xlsx');
const { conversionCounter, activeJobsGauge } = require('../metrics');
const { LIBRE_OFFICE_PATH, TEMP_DIR } = require('../config');
const { logger } = require('../logger');

const docFormats = ['pdf', 'doc', 'docx', 'odt', 'rtf', 'txt', 'html'];
const sheetFormats = ['xlsx', 'xls', 'csv', 'ods'];

async function convertDocument(inputPath, tempDir, targetFormat, inputExt, job) {
  const outputDir = path.join(tempDir, 'output');
  await fs.mkdir(outputDir, { recursive: true });
  const profileDir = path.join(tempDir, 'lo-profile');
  await fs.mkdir(profileDir, { recursive: true });

  await job.updateProgress(30);

  await new Promise((resolve, reject) => {
    const isPdf = inputExt === 'pdf';
    const convertTo = targetFormat === 'docx' ? 'docx' : targetFormat;
    const profileUrl = pathToFileURL(profileDir).href;
    const args = [
      '--headless',
      '--nologo',
      '--nofirststartwizard',
      '--norestore',
      '--nolockcheck',
      '--nodefault',
      `--env:UserInstallation=${profileUrl}`,
      ...(isPdf ? ['--infilter=writer_pdf_import'] : []),
      '--convert-to',
      convertTo,
      '--outdir',
      outputDir,
      inputPath
    ];

    const proc = spawn(LIBRE_OFFICE_PATH, args, {
      stdio: 'pipe',
      env: {
        ...process.env,
        HOME: profileDir,
        TMPDIR: profileDir
      }
    });

    const timeoutMs = 120000;
    const timer = setTimeout(() => {
      proc.kill('SIGKILL');
      reject(new Error(`LibreOffice conversion timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    let stderr = '';
    let stdout = '';
    proc.stdout?.on('data', (data) => { stdout += data.toString(); });
    proc.stderr?.on('data', (data) => { stderr += data.toString(); });

    proc.on('close', (code) => {
      clearTimeout(timer);
      if (code === 0) resolve();
      else reject(new Error(`LibreOffice exited with code ${code}: ${stderr}`));
    });
    proc.on('error', (err) => {
      clearTimeout(timer);
      reject(new Error(`Failed to start LibreOffice: ${err.message}`));
    });
  });

  await job.updateProgress(80);
  const files = await fs.readdir(outputDir);
  if (files.length === 0) throw new Error('No output file generated');
  return path.join(outputDir, files[0]);
}

async function convertSpreadsheet(inputPath, tempDir, targetFormat, job) {
  await job.updateProgress(30);
  const workbook = xlsx.readFile(inputPath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  await job.updateProgress(60);

  let outputPath;
  if (targetFormat === 'csv') {
    const outputData = xlsx.utils.sheet_to_csv(sheet);
    outputPath = path.join(tempDir, 'output.csv');
    await fs.writeFile(outputPath, outputData, 'utf-8');
  } else if (targetFormat === 'xlsx' || targetFormat === 'xls') {
    const newWorkbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(newWorkbook, sheet, sheetName);
    outputPath = path.join(tempDir, `output.${targetFormat}`);
    xlsx.writeFile(newWorkbook, outputPath);
  } else {
    throw new Error(`Unsupported spreadsheet format: ${targetFormat}`);
  }

  await job.updateProgress(90);
  return outputPath;
}

async function processFileConversion(job) {
  const { jobId, inputPath, targetFormat, inputExt } = job.data;
  try {
    activeJobsGauge.labels('file').inc();
    const tempDir = path.join(TEMP_DIR, jobId);
    await fs.mkdir(tempDir, { recursive: true });
    await job.updateProgress(10);

    let outputPath;
    if (docFormats.includes(inputExt) && docFormats.includes(targetFormat)) {
      outputPath = await convertDocument(inputPath, tempDir, targetFormat, inputExt, job);
    } else if (sheetFormats.includes(inputExt) && sheetFormats.includes(targetFormat)) {
      outputPath = await convertSpreadsheet(inputPath, tempDir, targetFormat, job);
    } else {
      throw new Error(`Unsupported conversion: ${inputExt} to ${targetFormat}`);
    }

    await job.updateProgress(100);
    conversionCounter.labels('file', 'success').inc();
    activeJobsGauge.labels('file').dec();
    return { outputPath, success: true };
  } catch (error) {
    logger.error({ error, jobId }, 'File conversion error');
    conversionCounter.labels('file', 'failed').inc();
    activeJobsGauge.labels('file').dec();
    throw error;
  }
}

module.exports = { processFileConversion };
