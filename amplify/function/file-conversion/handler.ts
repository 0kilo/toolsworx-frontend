import { spawn } from 'child_process';
import { writeFileSync, readFileSync, mkdtempSync, rmSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { randomUUID } from 'crypto';
import * as XLSX from 'xlsx';

export const handler = async (event: any) => {
  const { fileData, fileName, targetFormat, options = {} } = event.arguments;
  
  if (!fileData || !targetFormat) {
    throw new Error('Missing fileData or targetFormat');
  }

  const jobId = randomUUID();
  const tempDir = mkdtempSync(join(tmpdir(), 'convert-'));
  
  try {
    const inputPath = join(tempDir, 'input');
    const fileBuffer = Buffer.from(fileData, 'base64');
    writeFileSync(inputPath, fileBuffer);

    const inputExt = fileName.split('.').pop()?.toLowerCase() || '';
    let outputPath: string;

    const docFormats = ['pdf', 'doc', 'docx', 'odt', 'rtf', 'txt', 'html'];
    const sheetFormats = ['xlsx', 'xls', 'csv', 'ods'];

    if (docFormats.includes(inputExt) && docFormats.includes(targetFormat)) {
      outputPath = await convertDocument(inputPath, tempDir, targetFormat);
    } else if (sheetFormats.includes(inputExt) && sheetFormats.includes(targetFormat)) {
      outputPath = await convertSpreadsheet(inputPath, tempDir, targetFormat);
    } else {
      throw new Error(`Unsupported conversion: ${inputExt} to ${targetFormat}`);
    }

    const outputBuffer = readFileSync(outputPath);
    const base64Output = outputBuffer.toString('base64');
    
    return {
      success: true,
      jobId,
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

function getContentType(format: string): string {
  const types: Record<string, string> = {
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    csv: 'text/csv'
  };
  return types[format] || 'application/octet-stream';
}