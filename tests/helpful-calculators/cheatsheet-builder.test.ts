import { loadJson, assertToolContent } from "../_helpers/content";

export async function run() {
  const content = loadJson("app/helpful-calculators/cheatsheet-builder/cheatsheet-builder.json");
  assertToolContent(content);
}
