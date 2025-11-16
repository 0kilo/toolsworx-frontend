import type { APIGatewayProxyHandler } from 'aws-lambda';
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
    const { fileData, fileName, filters = [], outputFormat = 'jpeg' } = JSON.parse(event.body || '{}');
    
    if (!fileData) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing fileData' })
      };
    }

    const jobId = uuidv4();
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'filter-'));
    
    try {
      const inputPath = path.join(tempDir, 'input');
      const fileBuffer = Buffer.from(fileData, 'base64');
      await fs.writeFile(inputPath, fileBuffer);

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
        }
      }

      const outputPath = path.join(tempDir, `output.${outputFormat}`);
      await pipeline.toFile(outputPath);

      const outputBuffer = await fs.readFile(outputPath);
      const base64Output = outputBuffer.toString('base64');
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          jobId,
          downloadUrl: `data:image/${outputFormat};base64,${base64Output}`,
          appliedFilters: filters.map((f: any) => f.type)
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