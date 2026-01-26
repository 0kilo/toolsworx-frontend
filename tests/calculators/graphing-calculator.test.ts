import { loadJson, assertToolContent } from "../_helpers/content";

export async function run() {
  const content = loadJson("app/calculators/graphing/graphing.json");
  assertToolContent(content);
}
