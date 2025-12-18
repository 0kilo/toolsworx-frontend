const path = require('path');
const fs = require('fs').promises;
const sharp = require('sharp');
const ffmpeg = require('fluent-ffmpeg');
const { conversionCounter, activeJobsGauge } = require('../metrics');
const { TEMP_DIR } = require('../config');
const { logger } = require('../logger');

const imageFormats = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'tiff'];

async function processMediaConversion(job) {
  const { jobId, inputPath, targetFormat, inputExt, options = {} } = job.data;

  try {
    activeJobsGauge.labels('media').inc();
    const tempDir = path.join(TEMP_DIR, jobId);
    await fs.mkdir(tempDir, { recursive: true });
    await job.updateProgress(10);

    const outputPath = path.join(tempDir, `output.${targetFormat}`);

    if (imageFormats.includes(inputExt) && imageFormats.includes(targetFormat)) {
      await job.updateProgress(30);
      await sharp(inputPath)
        .toFormat(targetFormat === 'jpg' ? 'jpeg' : targetFormat, {
          quality: options.quality || 90
        })
        .toFile(outputPath);
      await job.updateProgress(100);
      conversionCounter.labels('media', 'success').inc();
      activeJobsGauge.labels('media').dec();
      return { outputPath, success: true };
    }

    await new Promise((resolve, reject) => {
      let command = ffmpeg(inputPath)
        .output(outputPath)
        .on('end', () => resolve())
        .on('error', reject)
        .on('progress', (progress) => {
          job.updateProgress(Math.min(progress.percent || 0, 95));
        });

      if (options.videoCodec) command = command.videoCodec(options.videoCodec);
      if (options.audioCodec) command = command.audioCodec(options.audioCodec);
      if (options.bitrate) command = command.videoBitrate(options.bitrate);
      if (options.resolution) command = command.size(options.resolution);
      if (options.framerate) command = command.fps(options.framerate);

      command.run();
    });

    await job.updateProgress(100);
    conversionCounter.labels('media', 'success').inc();
    activeJobsGauge.labels('media').dec();
    return { outputPath, success: true };
  } catch (error) {
    logger.error({ error, jobId }, 'Media conversion error');
    conversionCounter.labels('media', 'failed').inc();
    activeJobsGauge.labels('media').dec();
    throw error;
  }
}

module.exports = { processMediaConversion };
