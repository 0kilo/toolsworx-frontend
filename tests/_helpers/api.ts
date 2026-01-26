import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const API_BASE_URL = process.env.CONVERSION_API_BASE || "http://localhost:3010";
const SESSION_ID =
  process.env.TEST_SESSION_ID || `test-${Date.now()}-${Math.random().toString(16).slice(2)}`;
const API_KEY = process.env.TEST_API_KEY || "";
const ORIGIN = process.env.TEST_ORIGIN || "";
const TIMEOUT_MS = Number(process.env.TEST_TIMEOUT_MS || 120000);
const POLL_INTERVAL_MS = Number(process.env.TEST_POLL_INTERVAL_MS || 2000);

function baseHeaders() {
  return {
    "x-session-id": SESSION_ID,
    ...(API_KEY ? { "x-api-key": API_KEY } : {}),
    ...(ORIGIN ? { Origin: ORIGIN } : {}),
  };
}

function buildForm(filePath: string, fields: Record<string, string>) {
  const buffer = fs.readFileSync(filePath);
  const form = new FormData();
  form.append("file", new Blob([buffer]), path.basename(filePath));
  Object.entries(fields).forEach(([key, value]) => {
    form.append(key, value);
  });
  return form;
}

async function postForm(endpoint: string, filePath: string, fields: Record<string, string>) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: baseHeaders(),
    body: buildForm(filePath, fields),
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Request failed (${response.status}): ${body}`);
  }
  return response.json();
}

async function pollStatus(endpoint: string, jobId: string) {
  const start = Date.now();
  while (Date.now() - start < TIMEOUT_MS) {
    const response = await fetch(`${API_BASE_URL}${endpoint}/${jobId}`, {
      headers: baseHeaders(),
    });
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Status failed (${response.status}): ${body}`);
    }
    const payload = await response.json();
    if (payload.status === "completed") return payload;
    if (payload.status === "failed") {
      throw new Error(`Conversion failed: ${payload.error || "unknown error"}`);
    }
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }
  throw new Error(`Timeout waiting for completion after ${TIMEOUT_MS}ms`);
}

function assertMagic(buffer: Buffer, expectedType: string) {
  switch (expectedType) {
    case "zip":
      assert.ok(
        buffer.length >= 4 && buffer[0] === 0x50 && buffer[1] === 0x4b,
        "Expected ZIP signature (PK)"
      );
      break;
    case "webp":
      assert.ok(
        buffer.length >= 12 &&
          buffer.toString("ascii", 0, 4) === "RIFF" &&
          buffer.toString("ascii", 8, 12) === "WEBP",
        "Expected WEBP signature"
      );
      break;
    case "mp3": {
      const hasId3 = buffer.length >= 3 && buffer.toString("ascii", 0, 3) === "ID3";
      const hasMpegFrame =
        buffer.length >= 2 && buffer[0] === 0xff && (buffer[1] & 0xe0) === 0xe0;
      assert.ok(hasId3 || hasMpegFrame, "Expected MP3 signature");
      break;
    }
    case "mp4":
      assert.ok(
        buffer.length >= 12 && buffer.toString("ascii", 4, 8) === "ftyp",
        "Expected MP4 ftyp box"
      );
      break;
    case "jpeg":
      assert.ok(
        buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff,
        "Expected JPEG signature"
      );
      break;
    case "csv": {
      const text = buffer.toString("utf8");
      const hasDelimiter = text.includes(",") || text.includes(";") || text.includes("\t");
      const hasNewline = text.includes("\n") || text.includes("\r");
      assert.ok(hasDelimiter || hasNewline, "Expected CSV content");
      break;
    }
    default:
      throw new Error(`Unknown expected type: ${expectedType}`);
  }
}

async function download(endpoint: string, jobId: string, expectedType?: string) {
  const response = await fetch(`${API_BASE_URL}${endpoint}/${jobId}`, {
    headers: baseHeaders(),
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Download failed (${response.status}): ${body}`);
  }
  const data = await response.arrayBuffer();
  if (!data || data.byteLength === 0) {
    throw new Error("Downloaded file is empty");
  }
  if (expectedType) {
    assertMagic(Buffer.from(data), expectedType);
  }
}

export async function runFileConversionTest(
  filePath: string,
  targetFormat: string,
  expectedType?: string
) {
  const payload = await postForm("/api/convert", filePath, { targetFormat });
  const status = await pollStatus("/api/status", payload.jobId);
  await download("/api/download", payload.jobId, expectedType);
  return status;
}

export async function runMediaConversionTest(
  filePath: string,
  targetFormat: string,
  expectedType?: string
) {
  const payload = await postForm("/api/media/convert", filePath, { targetFormat });
  const status = await pollStatus("/api/media/status", payload.jobId);
  await download("/api/media/download", payload.jobId, expectedType);
  return status;
}

export async function runImageFilterTest(
  filePath: string,
  filterType: string,
  outputFormat: string = "jpeg",
  expectedType?: string
) {
  const payload = await postForm("/api/filter", filePath, {
    filterType,
    outputFormat,
  });
  const status = await pollStatus("/api/filter/status", payload.jobId);
  await download("/api/filter/download", payload.jobId, expectedType);
  return status;
}

export async function runAudioFilterTest(
  filePath: string,
  filterType: string,
  outputFormat: string = "mp3",
  expectedType?: string
) {
  const payload = await postForm("/api/audio/filter", filePath, {
    filterType,
    options: JSON.stringify({ outputFormat }),
  });
  const status = await pollStatus("/api/audio/status", payload.jobId);
  await download("/api/audio/download", payload.jobId, expectedType);
  return status;
}
