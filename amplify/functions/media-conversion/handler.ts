import type { APIGatewayProxyHandler } from 'aws-lambda';
import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as os from 'os';
import { v4 as uuidv4 } from 'uuid';
import * as sharp from 'sharp';

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
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'media-'));
    
    try {
      const inputPath = path.join(tempDir, 'input');
      const fileBuffer = Buffer.from(fileData, 'base64');
      await fs.writeFile(inputPath, fileBuffer);

      const inputExt = path.extname(fileName).toLowerCase().slice(1);
      const outputPath = path.join(tempDir, `output.${targetFormat}`);

      const imageFormats = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'tiff'];
      
      if (imageFormats.includes(inputExt) && imageFormats.includes(targetFormat)) {
        await sharp(inputPath)
          .toFormat(targetFormat === 'jpg' ? 'jpeg' : targetFormat as any, {
            quality: options.quality || 90
          })
          .toFile(outputPath);
      } else {
        await convertWithFFmpeg(inputPath, outputPath, options);
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

async function convertWithFFmpeg(inputPath: string, outputPath: string, options: any): Promise<void> {
  return new Promise((resolve, reject) => {
    const args = ['-i', inputPath];

    if (options.videoCodec) args.push('-c:v', options.videoCodec);
    if (options.audioCodec) args.push('-c:a', options.audioCodec);
    if (options.bitrate) args.push('-b:v', options.bitrate);
    if (options.resolution) args.push('-s', options.resolution);

    args.push('-y', outputPath);

    const process = spawn('/opt/ffmpeg/bin/ffmpeg', args, { timeout: 300000 });

    let stderr = '';
    process.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    process.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`FFmpeg failed: ${stderr}`));
    });
  });
}

function getContentType(format: string): string {
  const types: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    mp3: 'audio/mpeg',
    mp4: 'video/mp4',
    avi: 'video/x-msvideo'
  };
  return types[format] || 'application/octet-stream';
}