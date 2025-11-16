import type { APIGatewayProxyHandler } from 'aws-lambda';
import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as os from 'os';
import { v4 as uuidv4 } from 'uuid';
import * as xlsx from 'xlsx';

export const handler: APIGatewayProxyHandler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { fileData, fileName, targetFormat, options = {} } = JSON.parse(event.body || '{}');
    
    if (!fileData || !targetFormat) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing fileData or targetFormat' })
      };
    }

    const jobId = uuidv4();
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'convert-'));
    
    try {
      const inputPath = path.join(tempDir, 'input');
      const fileBuffer = Buffer.from(fileData, 'base64');
      await fs.writeFile(inputPath, fileBuffer);

      const inputExt = path.extname(fileName).toLowerCase().slice(1);
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

      const outputBuffer = await fs.readFile(outputPath);
      const base64Output = outputBuffer.toString('base64');
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          jobId,
          downloadUrl: `data:${getContentType(targetFormat)};base64,${base64Output}`
        })
      };

    } finally {
      await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
    }

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: (error as Error).message })
    };
  }
};

async function convertDocument(inputPath: string, tempDir: string, targetFormat: string): Promise<string> {
  const outputDir = path.join(tempDir, 'output');
  await fs.mkdir(outputDir, { recursive: true });

  return new Promise((resolve, reject) => {
    const process = spawn('/opt/libreoffice7.6/program/soffice', [
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

    process.on('close', async (code) => {
      if (code === 0) {
        const files = await fs.readdir(outputDir);
        resolve(path.join(outputDir, files[0]));
      } else {
        reject(new Error(`LibreOffice failed: ${stderr}`));
      }
    });
  });
}

async function convertSpreadsheet(inputPath: string, tempDir: string, targetFormat: string): Promise<string> {
  const workbook = xlsx.readFile(inputPath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  let outputPath: string;

  if (targetFormat === 'csv') {
    const csv = xlsx.utils.sheet_to_csv(sheet);
    outputPath = path.join(tempDir, 'output.csv');
    await fs.writeFile(outputPath, csv);
  } else {
    const newWorkbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(newWorkbook, sheet, 'Sheet1');
    outputPath = path.join(tempDir, `output.${targetFormat}`);
    xlsx.writeFile(newWorkbook, outputPath);
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