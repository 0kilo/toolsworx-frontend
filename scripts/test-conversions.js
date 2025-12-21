const fs = require('fs');
const path = require('path');

const API_BASE_URL = process.env.CONVERSION_API_BASE || 'http://localhost:3010';
const SESSION_ID = process.env.TEST_SESSION_ID || `test-${Date.now()}-${Math.random().toString(16).slice(2)}`;
const API_KEY = process.env.TEST_API_KEY || '';
const ORIGIN = process.env.TEST_ORIGIN || '';
const TIMEOUT_MS = Number(process.env.TEST_TIMEOUT_MS || 120000);
const POLL_INTERVAL_MS = Number(process.env.TEST_POLL_INTERVAL_MS || 2000);

const baseHeaders = {
  'x-session-id': SESSION_ID,
  ...(API_KEY ? { 'x-api-key': API_KEY } : {}),
  ...(ORIGIN ? { Origin: ORIGIN } : {})
};

const fixtures = {
  pdf: path.join(__dirname, '..', 'tests', 'docs', 'TEST.pdf'),
  png: path.join(__dirname, '..', 'tests', 'media', 'sample.png')
};

const tests = [
  {
    name: 'file: pdf -> docx',
    convertPath: '/api/convert',
    statusPath: '/api/status',
    downloadPath: '/api/download',
    inputFile: fixtures.pdf,
    targetFormat: 'docx'
  },
  {
    name: 'media: png -> webp',
    convertPath: '/api/media/convert',
    statusPath: '/api/media/status',
    downloadPath: '/api/media/download',
    inputFile: fixtures.png,
    targetFormat: 'webp'
  }
];

function ensureFixture(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing test fixture: ${filePath}`);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildForm(filePath, targetFormat, options) {
  const buffer = fs.readFileSync(filePath);
  const form = new FormData();
  const blob = new Blob([buffer]);
  form.append('file', blob, path.basename(filePath));
  form.append('targetFormat', targetFormat);
  if (options && Object.keys(options).length > 0) {
    form.append('options', JSON.stringify(options));
  }
  return form;
}

async function postConversion(testCase) {
  const url = `${API_BASE_URL}${testCase.convertPath}`;
  const form = buildForm(testCase.inputFile, testCase.targetFormat, testCase.options);
  const response = await fetch(url, {
    method: 'POST',
    headers: baseHeaders,
    body: form
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Conversion request failed (${response.status}): ${body}`);
  }

  const payload = await response.json();
  if (!payload.jobId) {
    throw new Error(`Missing jobId in response: ${JSON.stringify(payload)}`);
  }

  return payload;
}

async function pollStatus(testCase, jobId) {
  const url = `${API_BASE_URL}${testCase.statusPath}/${jobId}`;
  const start = Date.now();

  while (Date.now() - start < TIMEOUT_MS) {
    const response = await fetch(url, { headers: baseHeaders });
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Status request failed (${response.status}): ${body}`);
    }
    const payload = await response.json();
    if (payload.status === 'completed') {
      return payload;
    }
    if (payload.status === 'failed') {
      throw new Error(`Conversion failed: ${payload.error || 'unknown error'}`);
    }
    await sleep(POLL_INTERVAL_MS);
  }

  throw new Error(`Timeout waiting for completion after ${TIMEOUT_MS}ms`);
}

async function downloadResult(testCase, jobId) {
  const url = `${API_BASE_URL}${testCase.downloadPath}/${jobId}`;
  const response = await fetch(url, { headers: baseHeaders });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Download failed (${response.status}): ${body}`);
  }
  const data = await response.arrayBuffer();
  if (!data || data.byteLength === 0) {
    throw new Error('Downloaded file is empty');
  }
}

async function run() {
  console.log(`Running conversion tests against ${API_BASE_URL}`);
  for (const testCase of tests) {
    ensureFixture(testCase.inputFile);
    console.log(`\n${testCase.name}`);
    const { jobId } = await postConversion(testCase);
    const status = await pollStatus(testCase, jobId);
    await downloadResult(testCase, jobId);
    console.log(`✔ Completed (${status.status})`);
  }
  console.log('\nAll conversion tests passed.');
}

run().catch((error) => {
  console.error(`\nConversion tests failed: ${error.message}`);
  process.exit(1);
});
