const path = require('path');
const fs = require('fs').promises;
const { randomUUID } = require('crypto');
const { McpServer } = require('@modelcontextprotocol/sdk/server/mcp.js');
const z = require('zod');

const { TEMP_DIR } = require('../config');
const { processFileConversion } = require('../processors/file');
const { processMediaConversion } = require('../processors/media');
const { processFilter } = require('../processors/filter');
const { processAudioFilter } = require('../processors/audio');

const MAX_PAYLOAD_BYTES = 12 * 1024 * 1024;
const DOCUMENT_FORMATS = ['pdf', 'doc', 'docx', 'odt', 'rtf', 'txt', 'html'];
const SPREADSHEET_FORMATS = ['xlsx', 'xls', 'csv', 'ods'];
const IMAGE_FORMATS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'tiff'];
const AUDIO_FILTERS = ['equalizer', 'reverb', 'echo', 'noise-reduction', 'normalize', 'bass-boost'];

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

function stripDataUrl(base64) {
  if (!base64) return '';
  const marker = 'base64,';
  const idx = base64.indexOf(marker);
  return idx >= 0 ? base64.slice(idx + marker.length) : base64;
}

function getBase64ByteLength(base64) {
  const raw = stripDataUrl(base64 || '');
  const padding = raw.endsWith('==') ? 2 : raw.endsWith('=') ? 1 : 0;
  return Math.floor((raw.length * 3) / 4) - padding;
}

function assertPayloadSize(base64) {
  const size = getBase64ByteLength(base64);
  if (size > MAX_PAYLOAD_BYTES) {
    throw new Error(`Payload too large (${size} bytes). Max allowed is ${MAX_PAYLOAD_BYTES} bytes.`);
  }
}

function getExtension(filename) {
  return path.extname(filename || '').toLowerCase().slice(1);
}

async function writeInputFile({ filename, contentBase64, tempDir }) {
  const safeName = filename ? path.basename(filename) : 'input';
  const inputPath = path.join(tempDir, safeName);
  const raw = stripDataUrl(contentBase64);
  const buffer = Buffer.from(raw, 'base64');
  await fs.writeFile(inputPath, buffer);
  return inputPath;
}

function buildJob(data) {
  return {
    data,
    progress: 0,
    async updateProgress(value) {
      const next = Number(value);
      if (!Number.isNaN(next)) {
        this.progress = Math.max(0, Math.min(100, Math.round(next)));
      }
    }
  };
}

async function runConversion(processor, payload) {
  const job = buildJob(payload);
  const result = await processor(job);
  return { result, progress: job.progress };
}

async function convertAndReadOutput(processor, payload, outputName) {
  const { result } = await runConversion(processor, payload);
  const outputPath = result.outputPath;
  const outputBuffer = await fs.readFile(outputPath);
  return {
    filename: outputName || path.basename(outputPath),
    contentBase64: outputBuffer.toString('base64'),
    outputPath,
    bytes: outputBuffer.length
  };
}

function buildResponsePayload(result) {
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          filename: result.filename,
          bytes: result.bytes,
          contentBase64: result.contentBase64
        })
      }
    ]
  };
}

function createMcpServer() {
  const server = new McpServer(
    { name: 'toolsworx-mcp', version: '1.0.0' },
    { capabilities: { logging: {} } }
  );

  server.registerTool(
    'file.convert',
    {
      description: [
        'Convert document and spreadsheet files using base64 input.',
        'Max payload: 12MB (base64 overhead included).',
        'Supported document formats: pdf, doc, docx, odt, rtf, txt, html.',
        'Supported spreadsheet formats: xlsx, xls, csv, ods.',
        'Output format must be a supported document or spreadsheet format.',
      ].join(' '),
      inputSchema: {
        filename: z.string().describe('Original filename with extension'),
        contentBase64: z
          .string()
          .describe('Base64-encoded file content (no data URL prefix)'),
        targetFormat: z
          .string()
          .describe('Target file extension, e.g. docx, pdf, csv'),
        options: z
          .record(z.any())
          .optional()
          .describe('Optional conversion flags (currently unused)')
      }
    },
    async ({ filename, contentBase64, targetFormat, options = {} }) => {
      assertPayloadSize(contentBase64);
      const jobId = randomUUID();
      const tempDir = path.join(TEMP_DIR, jobId);
      await ensureDir(tempDir);

      const inputExt = getExtension(filename);
      if (!inputExt) throw new Error('Filename extension is required for conversion.');
      const outputExt = (targetFormat || '').toLowerCase();
      if (!outputExt) throw new Error('Target format is required for conversion.');
      if (
        (DOCUMENT_FORMATS.includes(inputExt) && !DOCUMENT_FORMATS.includes(outputExt)) ||
        (SPREADSHEET_FORMATS.includes(inputExt) && !SPREADSHEET_FORMATS.includes(outputExt))
      ) {
        throw new Error(`Unsupported conversion: ${inputExt} to ${outputExt}`);
      }

      const inputPath = await writeInputFile({ filename, contentBase64, tempDir });

      try {
        const payload = { jobId, inputPath, targetFormat: outputExt, inputExt, options };
        const result = await convertAndReadOutput(processFileConversion, payload);
        return buildResponsePayload(result);
      } finally {
        await fs.rm(tempDir, { recursive: true, force: true });
      }
    }
  );

  server.registerTool(
    'media.convert',
    {
      description: [
        'Convert image/audio/video files using base64 input.',
        'Max payload: 12MB (base64 overhead included).',
        'Image formats: jpg, jpeg, png, webp, gif, bmp, tiff.',
        'Audio/video formats are handled by ffmpeg (depends on container/codec support).',
        'Output is returned as base64.',
      ].join(' '),
      inputSchema: {
        filename: z.string().describe('Original filename with extension'),
        contentBase64: z
          .string()
          .describe('Base64-encoded file content (no data URL prefix)'),
        targetFormat: z
          .string()
          .describe('Target file extension, e.g. png, mp3, mp4'),
        options: z
          .record(z.any())
          .optional()
          .describe('Options: quality (images), videoCodec, audioCodec, bitrate, resolution, framerate')
      }
    },
    async ({ filename, contentBase64, targetFormat, options = {} }) => {
      assertPayloadSize(contentBase64);
      const jobId = randomUUID();
      const tempDir = path.join(TEMP_DIR, jobId);
      await ensureDir(tempDir);

      const inputExt = getExtension(filename);
      if (!inputExt) throw new Error('Filename extension is required for conversion.');
      const outputExt = (targetFormat || '').toLowerCase();
      if (!outputExt) throw new Error('Target format is required for conversion.');

      const inputPath = await writeInputFile({ filename, contentBase64, tempDir });

      try {
        const payload = { jobId, inputPath, targetFormat: outputExt, inputExt, options };
        const result = await convertAndReadOutput(processMediaConversion, payload);
        return buildResponsePayload(result);
      } finally {
        await fs.rm(tempDir, { recursive: true, force: true });
      }
    }
  );

  server.registerTool(
    'image.filter',
    {
      description: [
        'Apply image filters using base64 input.',
        'Max payload: 12MB (base64 overhead included).',
        'Filters: grayscale, blur, sharpen, brightness, contrast, saturation, hue, sepia, vintage.',
        'Output returned as base64 in outputFormat (default: jpeg).',
      ].join(' '),
      inputSchema: {
        filename: z.string().describe('Original filename with extension'),
        contentBase64: z
          .string()
          .describe('Base64-encoded file content (no data URL prefix)'),
        outputFormat: z
          .string()
          .optional()
          .describe('Output image format, default jpeg'),
        filters: z.array(
          z.object({
            type: z.string(),
            value: z.number().optional()
          })
        )
      }
    },
    async ({ filename, contentBase64, outputFormat = 'jpeg', filters }) => {
      assertPayloadSize(contentBase64);
      const jobId = randomUUID();
      const tempDir = path.join(TEMP_DIR, jobId);
      await ensureDir(tempDir);

      const inputExt = getExtension(filename);
      if (!inputExt) throw new Error('Filename extension is required for filtering.');
      if (!IMAGE_FORMATS.includes(inputExt)) {
        throw new Error(`Unsupported image input format: ${inputExt}`);
      }

      const outputExt = (outputFormat || 'jpeg').toLowerCase();
      if (!IMAGE_FORMATS.includes(outputExt)) {
        throw new Error(`Unsupported image output format: ${outputExt}`);
      }

      const inputPath = await writeInputFile({ filename, contentBase64, tempDir });
      try {
        const payload = { jobId, inputPath, filters, outputFormat: outputExt };
        const result = await convertAndReadOutput(processFilter, payload);
        return buildResponsePayload(result);
      } finally {
        await fs.rm(tempDir, { recursive: true, force: true });
      }
    }
  );

  server.registerTool(
    'audio.filter',
    {
      description: [
        'Apply audio filters using base64 input.',
        'Max payload: 12MB (base64 overhead included).',
        'Filter types: equalizer, reverb, echo, noise-reduction, normalize, bass-boost.',
        'Output returned as base64, default mp3 unless options.outputFormat is set.',
      ].join(' '),
      inputSchema: {
        filename: z.string().describe('Original filename with extension'),
        contentBase64: z
          .string()
          .describe('Base64-encoded file content (no data URL prefix)'),
        filterType: z
          .string()
          .describe('Filter type: equalizer, reverb, echo, noise-reduction, normalize, bass-boost'),
        options: z
          .record(z.any())
          .optional()
          .describe('Options: outputFormat, bitrate, bands (equalizer), amount/delay/decay/gain')
      }
    },
    async ({ filename, contentBase64, filterType, options = {} }) => {
      assertPayloadSize(contentBase64);
      const jobId = randomUUID();
      const tempDir = path.join(TEMP_DIR, jobId);
      await ensureDir(tempDir);

      const inputExt = getExtension(filename);
      if (!inputExt) throw new Error('Filename extension is required for audio filtering.');
      const filter = (filterType || '').toLowerCase();
      if (!AUDIO_FILTERS.includes(filter)) {
        throw new Error(`Unsupported audio filter type: ${filterType}`);
      }

      const inputPath = await writeInputFile({ filename, contentBase64, tempDir });
      try {
        const payload = { jobId, inputPath, filterType: filter, options };
        const result = await convertAndReadOutput(processAudioFilter, payload);
        return buildResponsePayload(result);
      } finally {
        await fs.rm(tempDir, { recursive: true, force: true });
      }
    }
  );

  return server;
}

module.exports = { createMcpServer };
