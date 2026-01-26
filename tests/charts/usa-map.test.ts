import { loadJson, assertToolContent } from "../_helpers/content";

export async function run() {
  const content = loadJson("app/charts/usa-map/usa-map.json");
  assertToolContent(content);
}
