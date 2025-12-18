const path = require('path');
const fs = require('fs').promises;
const { spawn } = require('child_process');
const { conversionCounter, activeJobsGauge } = require('../metrics');
const { TEMP_DIR, FFMPEG_PATH } = require('../config');
const { logger } = require('../logger');

async function applyAudioFilter(inputPath, outputPath, filterType, options) {
  return new Promise((resolve, reject) => {
    const args = ['-i', inputPath];

    switch (filterType) {
      case 'equalizer': {
        const bands = options.bands || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        const eqFilter = `equalizer=f=32:width_type=o:width=2:g=${bands[0]},` +
          `equalizer=f=64:width_type=o:width=2:g=${bands[1]},` +
          `equalizer=f=125:width_type=o:width=2:g=${bands[2]},` +
          `equalizer=f=250:width_type=o:width=2:g=${bands[3]},` +
          `equalizer=f=500:width_type=o:width=2:g=${bands[4]},` +
          `equalizer=f=1000:width_type=o:width=2:g=${bands[5]},` +
          `equalizer=f=2000:width_type=o:width=2:g=${bands[6]},` +
          `equalizer=f=4000:width_type=o:width=2:g=${bands[7]},` +
          `equalizer=f=8000:width_type=o:width=2:g=${bands[8]},` +
          `equalizer=f=16000:width_type=o:width=2:g=${bands[9]}`;
        args.push('-af', eqFilter);
        break;
      }
      case 'reverb': {
        const reverbAmount = options.amount || 50;
        args.push('-af', `aecho=0.8:0.88:${reverbAmount}:0.4`);
        break;
      }
      case 'echo': {
        const echoDelay = options.delay || 1000;
        const echoDecay = options.decay || 0.5;
        args.push('-af', `aecho=0.8:0.9:${echoDelay}:${echoDecay}`);
        break;
      }
      case 'noise-reduction':
        args.push('-af', 'highpass=f=200,lowpass=f=3000,afftdn=nf=-25');
        break;
      case 'normalize':
        args.push('-af', 'loudnorm=I=-16:TP=-1.5:LRA=11');
        break;
      case 'bass-boost': {
        const bassGain = options.gain || 10;
        args.push('-af', `bass=g=${bassGain}:f=110:w=0.3`);
        break;
      }
      default:
        return reject(new Error(`Unknown filter type: ${filterType}`));
    }

    if (options.bitrate) {
      args.push('-b:a', options.bitrate);
    }

    args.push('-y', outputPath);

    const proc = spawn(FFMPEG_PATH, args, { timeout: 300000 });
    let stderr = '';
    proc.stderr?.on('data', (data) => { stderr += data.toString(); });

    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`FFmpeg failed: ${stderr}`));
    });
    proc.on('error', (err) => reject(err));
  });
}

async function processAudioFilter(job) {
  const { jobId, inputPath, filterType, options = {} } = job.data;
  try {
    activeJobsGauge.labels('audio').inc();
    const tempDir = path.join(TEMP_DIR, jobId);
    await fs.mkdir(tempDir, { recursive: true });

    await job.updateProgress(20);
    const outputExt = options.outputFormat || 'mp3';
    const outputPath = path.join(tempDir, `output.${outputExt}`);

    await applyAudioFilter(inputPath, outputPath, filterType, options);
    await job.updateProgress(100);

    conversionCounter.labels('audio', 'success').inc();
    activeJobsGauge.labels('audio').dec();
    return { outputPath, success: true };
  } catch (error) {
    logger.error({ error, jobId }, 'Audio filter error');
    conversionCounter.labels('audio', 'failed').inc();
    activeJobsGauge.labels('audio').dec();
    throw error;
  }
}

module.exports = { processAudioFilter };
