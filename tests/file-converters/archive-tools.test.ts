import { loadJson, assertToolContent } from "../_helpers/content";

export async function run() {
  const content = loadJson("app/file-converters/archive/archive.json");
  assertToolContent(content);
}
