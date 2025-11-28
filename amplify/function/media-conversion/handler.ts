import { spawn } from 'child_process';
import { writeFileSync, readFileSync, mkdtempSync, rmSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { randomUUID } from 'crypto';
import sharp from 'sharp';

export const handler = async (event: any) => {
  const { jobId, fileData, fileName, targetFormat, options } = event.arguments;
  const conversionOptions = options || {};

  if (!fileData || !targetFormat) {
    throw new Error('Missing fileData or targetFormat');
  }
  const tempDir = mkdtempSync(join(tmpdir(), 'media-'));

  try {
    const inputPath = join(tempDir, 'input');
    const fileBuffer = Buffer.from(fileData, 'base64');
    writeFileSync(inputPath, fileBuffer);

    const inputExt = fileName.split('.').pop()?.toLowerCase() || '';
    const outputPath = join(tempDir, `output.${targetFormat}`);

    const imageFormats = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'tiff'];

    if (imageFormats.includes(inputExt) && imageFormats.includes(targetFormat)) {
      await sharp(inputPath)
        .toFormat(targetFormat === 'jpg' ? 'jpeg' : targetFormat as any, {
          quality: conversionOptions.quality || 90
        })
        .toFile(outputPath);
    } else {
      await convertWithFFmpeg(inputPath, outputPath, conversionOptions);
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