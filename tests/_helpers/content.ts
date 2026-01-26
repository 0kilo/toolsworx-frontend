import fs from "node:fs";
import path from "node:path";
import { assertTruthy } from "./assert";

export function loadJson<T = any>(relativePath: string): T {
  const filePath = path.resolve(process.cwd(), relativePath);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

export function assertToolContent(content: { title?: string; description?: string; sections?: unknown[] }) {
  assertTruthy(content.title, "Expected tool content to include a title");
  assertTruthy(content.description, "Expected tool content to include a description");
  if (content.sections !== undefined) {
    assertTruthy(Array.isArray(content.sections), "Expected sections to be an array when present");
  }
}
