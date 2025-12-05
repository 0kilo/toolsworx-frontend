import { spawn } from 'child_process';
import { writeFileSync, readFileSync, mkdtempSync, rmSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { randomUUID } from 'crypto';
import * as XLSX from 'xlsx';

export const handler = async (event: any) => {
  const { fileData, fileName, targetFormat, options = {} } = event.arguments;
  
  if (!fileData || !targetFormat) {
    throw new Error('Missing fileData or targetFormat');
  }


  const tempDir = mkdtempSync(join(tmpdir(), 'convert-'));
  
  try {
    const inputPath = join(tempDir, 'input');
    const fileBuffer = Buffer.from(fileData, 'base64');
    writeFileSync(inputPath, fileBuffer);

    const inputExt = fileName.split('.').pop()?.toLowerCase() || '';
    let outputPath: string;

    const docFormats = ['pdf', 'doc', 'docx', 'odt', 'rtf', 'txt', 'html'];
    const sheetFormats = ['xlsx', 'xls', 'csv', 'ods'];
    const archiveFormats = ['zip', 'tar', 'bz2'];

    if (docFormats.includes(inputExt) && docFormats.includes(targetFormat)) {
      outputPath = await convertDocument(inputPath, tempDir, targetFormat);
    } else if (sheetFormats.includes(inputExt) && sheetFormats.includes(targetFormat)) {
      outputPath = await convertSpreadsheet(inputPath, tempDir, targetFormat);
    } else if (archiveFormats.includes(inputExt) || archiveFormats.includes(targetFormat)) {
      outputPath = await convertArchive(inputPath, tempDir, inputExt, targetFormat, options);
    } else {
      throw new Error(`Unsupported conversion: ${inputExt} to ${targetFormat}`);
    }

    const outputBuffer = readFileSync(outputPath);
    const base64Output = outputBuffer.toString('base64');
    
    return {
      success: true,
      downloadUrl: `data:${getContentType(targetFormat)};base64,${base64Output}`
    };

  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
};

async function convertDocument(inputPath: string, tempDir: string, targetFormat: string): Promise<string> {
  const outputDir = join(tempDir, 'output');
  
  return new Promise((resolve, reject) => {
    const process = spawn('/opt/libreoffice/program/soffice', [
      '--headless',
      '--convert-to',
      targetFormat,
      '--outdir',
      outputDir,
      inputPath
    ], { timeout: 120000 });

    let stderr = '';
    process.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    process.on('close', (code) => {
      if (code === 0) {
        const files = require('fs').readdirSync(outputDir);
        resolve(join(outputDir, files[0]));
      } else {
        reject(new Error(`LibreOffice failed: ${stderr}`));
      }
    });
  });
}

async function convertSpreadsheet(inputPath: string, tempDir: string, targetFormat: string): Promise<string> {
  const workbook = XLSX.readFile(inputPath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  let outputPath: string;

  if (targetFormat === 'csv') {
    const csv = XLSX.utils.sheet_to_csv(sheet);
    outputPath = join(tempDir, 'output.csv');
    writeFileSync(outputPath, csv);
  } else {
    const newWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbook, sheet, 'Sheet1');
    outputPath = join(tempDir, `output.${targetFormat}`);
    XLSX.writeFile(newWorkbook, outputPath);
  }

  return outputPath;
}

async function convertArchive(inputPath: string, tempDir: string, inputExt: string, targetFormat: string, options: any): Promise<string> {
  const extractDir = join(tempDir, 'extracted');
  const outputPath = join(tempDir, `output.${targetFormat}`);

  // Extract archive first
  if (['zip', 'tar', 'bz2'].includes(inputExt)) {
    await extractArchiveFile(inputPath, extractDir, inputExt);
  }

  // Create new archive
  await createArchiveFile(extractDir, outputPath, targetFormat, options);
  return outputPath;
}

async function extractArchiveFile(inputPath: string, outputDir: string, format: string): Promise<void> {
  const yauzl = require('yauzl');
  const tar = require('tar');
  const { mkdirSync, createWriteStream } = require('fs');
  const { join, dirname } = require('path');

  mkdirSync(outputDir, { recursive: true });

  if (format === 'zip') {
    return new Promise((resolve, reject) => {
      yauzl.open(inputPath, { lazyEntries: true }, (err: any, zipfile: any) => {
        if (err) return reject(err);
        
        zipfile.readEntry();
        zipfile.on('entry', (entry: any) => {
          const fullPath = join(outputDir, entry.fileName);
          
          if (/\/$/.test(entry.fileName)) {
            mkdirSync(fullPath, { recursive: true });
            zipfile.readEntry();
          } else {
            mkdirSync(dirname(fullPath), { recursive: true });
            zipfile.openReadStream(entry, (err: any, readStream: any) => {
              if (err) return reject(err);
              readStream.pipe(createWriteStream(fullPath));
              readStream.on('end', () => zipfile.readEntry());
            });
          }
        });
        
        zipfile.on('end', resolve);
        zipfile.on('error', reject);
      });
    });
  } else if (format === 'tar' || format === 'bz2') {
    return tar.x({ file: inputPath, cwd: outputDir });
  } else {
    throw new Error(`Unsupported extraction format: ${format}. Only ZIP and TAR supported.`);
  }
}

async function createArchiveFile(inputDir: string, outputPath: string, format: string, options: any): Promise<void> {
  const yazl = require('yazl');
  const tar = require('tar');
  const { readdirSync, statSync, createReadStream, createWriteStream } = require('fs');
  const { join, relative } = require('path');

  if (format === 'zip') {
    return new Promise((resolve, reject) => {
      const zipfile = new yazl.ZipFile();
      
      function addDirectory(dir: string) {
        const files = readdirSync(dir);
        for (const file of files) {
          const fullPath = join(dir, file);
          const relativePath = relative(inputDir, fullPath);
          const stat = statSync(fullPath);
          
          if (stat.isDirectory()) {
            addDirectory(fullPath);
          } else {
            zipfile.addFile(fullPath, relativePath);
          }
        }
      }
      
      addDirectory(inputDir);
      zipfile.end();
      
      zipfile.outputStream
        .pipe(createWriteStream(outputPath))
        .on('close', resolve)
        .on('error', reject);
    });
  } else if (format === 'tar' || format === 'bz2') {
    const tarOptions: any = { 
      file: outputPath, 
      cwd: inputDir,
      gzip: format === 'bz2'
    };
    return tar.c(tarOptions, ['.']);
  } else {
    throw new Error(`Unsupported compression format: ${format}. Only ZIP and TAR supported.`);
  }
}

function getContentType(format: string): string {
  const types: Record<string, string> = {
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    csv: 'text/csv',
    zip: 'application/zip',
    tar: 'application/x-tar',
    bz2: 'application/x-bzip2'
  };
  return types[format] || 'application/octet-stream';
}