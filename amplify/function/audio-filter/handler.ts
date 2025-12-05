import { spawn } from 'child_process';
import { writeFileSync, readFileSync, mkdtempSync, rmSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { checkRateLimit, incrementRateLimit } from '../rate-limiter';

const lambda = new LambdaClient({ region: process.env.AWS_REGION });

export const handler = async (event: any) => {
  const { jobId, fileData, fileName, filterType, options } = event.arguments;
  const filterOptions = options || {};
  const sessionId = filterOptions.sessionId || 'unknown';

  if (!fileData || !filterType) {
    throw new Error('Missing fileData or filterType');
  }

  // Check rate limit
  const rateLimit = await checkRateLimit(sessionId, `audio-${filterType}`);
  if (!rateLimit.allowed) {
    const resetDate = new Date(rateLimit.resetAt);
    throw new Error(`Rate limit exceeded. Resets at ${resetDate.toISOString()}. Daily limit: 3 uses.`);
  }

  const tempDir = mkdtempSync(join(tmpdir(), 'audio-'));

  try {
    const inputPath = join(tempDir, 'input');
    const fileBuffer = Buffer.from(fileData, 'base64');
    writeFileSync(inputPath, fileBuffer);

    const outputExt = filterOptions.outputFormat || 'mp3';
    const outputPath = join(tempDir, `output.${outputExt}`);

    // Apply audio filter using FFmpeg
    await applyAudioFilter(inputPath, outputPath, filterType, filterOptions);

    const outputBuffer = readFileSync(outputPath);
    const base64Output = outputBuffer.toString('base64');

    // Increment rate limit on success
    await incrementRateLimit(sessionId, `audio-${filterType}`);

    // Example: Invoke another Lambda function
    // await invokeLambda('other-function-name', { data: 'example' });

    return {
      success: true,
      jobId,
      downloadUrl: `data:audio/${outputExt};base64,${base64Output}`,
      filterApplied: filterType,
      remaining: rateLimit.remaining
    };

  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
};

async function applyAudioFilter(
  inputPath: string,
  outputPath: string,
  filterType: string,
  options: any
): Promise<void> {
  return new Promise((resolve, reject) => {
    const args = ['-i', inputPath];

    switch (filterType) {
      case 'equalizer':
        // 10-band equalizer
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

      case 'reverb':
        // Add reverb effect
        const reverbAmount = options.amount || 50;
        args.push('-af', `aecho=0.8:0.88:${reverbAmount}:0.4`);
        break;

      case 'echo':
        // Add echo effect
        const echoDelay = options.delay || 1000;
        const echoDecay = options.decay || 0.5;
        args.push('-af', `aecho=0.8:0.9:${echoDelay}:${echoDecay}`);
        break;

      case 'noise-reduction':
        // Apply noise reduction
        args.push('-af', 'highpass=f=200,lowpass=f=3000,afftdn=nf=-25');
        break;

      case 'normalize':
        // Normalize audio levels
        args.push('-af', 'loudnorm=I=-16:TP=-1.5:LRA=11');
        break;

      case 'bass-boost':
        // Boost bass frequencies
        const bassGain = options.gain || 10;
        args.push('-af', `bass=g=${bassGain}:f=110:w=0.3`);
        break;

      default:
        throw new Error(`Unknown filter type: ${filterType}`);
    }

    // Output settings
    if (options.bitrate) {
      args.push('-b:a', options.bitrate);
    }
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

    process.on('error', (err) => {
      reject(err);
    });
  });
}

// Helper function to invoke another Lambda
async function invokeLambda(functionName: string, payload: any) {
  const command = new InvokeCommand({
    FunctionName: functionName,
    Payload: JSON.stringify(payload)
  });
  
  const response = await lambda.send(command);
  return JSON.parse(new TextDecoder().decode(response.Payload));
}
