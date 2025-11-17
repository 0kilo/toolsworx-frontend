import { writeFileSync, readFileSync, mkdtempSync, rmSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { randomUUID } from 'crypto';
import sharp from 'sharp';

export const handler = async (event: any) => {
  const { fileData, fileName, filters = [], outputFormat = 'jpeg' } = event.arguments;
  
  if (!fileData) {
    throw new Error('Missing fileData');
  }

  const jobId = randomUUID();
  const tempDir = mkdtempSync(join(tmpdir(), 'filter-'));
  
  try {
    const inputPath = join(tempDir, 'input');
    const fileBuffer = Buffer.from(fileData, 'base64');
    writeFileSync(inputPath, fileBuffer);

    let pipeline = sharp(inputPath);

    for (const filter of filters) {
      switch (filter.type) {
        case 'grayscale':
          pipeline = pipeline.grayscale();
          break;
        case 'blur':
          pipeline = pipeline.blur(filter.value || 1);
          break;
        case 'sharpen':
          pipeline = pipeline.sharpen(filter.value || 1);
          break;
        case 'brightness':
          pipeline = pipeline.modulate({ brightness: 1 + (filter.value || 0) / 100 });
          break;
        case 'contrast':
          pipeline = pipeline.linear(1 + (filter.value || 0) / 100, 0);
          break;
        case 'saturation':
          pipeline = pipeline.modulate({ saturation: 1 + (filter.value || 0) / 100 });
          break;
        case 'hue':
          pipeline = pipeline.modulate({ hue: filter.value });
          break;
        case 'sepia':
          pipeline = pipeline.recomb([
            [0.393, 0.769, 0.189],
            [0.349, 0.686, 0.168],
            [0.272, 0.534, 0.131],
          ]);
          break;
        case 'vintage':
          pipeline = pipeline
            .modulate({ saturation: 0.8, brightness: 1.1 })
            .tint({ r: 255, g: 240, b: 200 });
          break;
        case 'resize':
          if (filter.width || filter.height) {
            pipeline = pipeline.resize(filter.width, filter.height, {
              fit: filter.fit || 'cover',
              withoutEnlargement: filter.withoutEnlargement || false
            });
          }
          break;
        case 'rotate':
          pipeline = pipeline.rotate(filter.angle || 90);
          break;
        case 'flip':
          pipeline = pipeline.flip();
          break;
        case 'flop':
          pipeline = pipeline.flop();
          break;
        case 'negate':
          pipeline = pipeline.negate();
          break;
        case 'normalize':
          pipeline = pipeline.normalize();
          break;
      }
    }

    const outputPath = join(tempDir, `output.${outputFormat}`);
    await pipeline.toFile(outputPath);

    const outputBuffer = readFileSync(outputPath);
    const base64Output = outputBuffer.toString('base64');
    
    return {
      success: true,
      jobId,
      downloadUrl: `data:image/${outputFormat};base64,${base64Output}`,
      appliedFilters: filters.map((f: any) => f.type)
    };

  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
};