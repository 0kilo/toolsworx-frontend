const path = require('path');
const fs = require('fs').promises;
const sharp = require('sharp');
const { conversionCounter, activeJobsGauge } = require('../metrics');
const { TEMP_DIR } = require('../config');
const { logger } = require('../logger');

async function processFilter(job) {
  const { jobId, inputPath, filters = [], outputFormat = 'jpeg' } = job.data;

  try {
    activeJobsGauge.labels('filter').inc();
    const tempDir = path.join(TEMP_DIR, jobId);
    await fs.mkdir(tempDir, { recursive: true });
    await job.updateProgress(10);

    let pipeline = sharp(inputPath);

    for (let idx = 0; idx < filters.length; idx++) {
      const filter = filters[idx];
      await job.updateProgress(10 + (idx / filters.length) * 80);

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
      }
    }

    const outputPath = path.join(tempDir, `output.${outputFormat}`);
    await pipeline.toFile(outputPath);

    await job.updateProgress(100);
    conversionCounter.labels('filter', 'success').inc();
    activeJobsGauge.labels('filter').dec();
    return { outputPath, success: true };
  } catch (error) {
    logger.error({ error, jobId }, 'Filter processing error');
    conversionCounter.labels('filter', 'failed').inc();
    activeJobsGauge.labels('filter').dec();
    throw error;
  }
}

module.exports = { processFilter };
