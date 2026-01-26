import { loadJson, assertToolContent } from "../_helpers/content";

export async function run() {
  const content = loadJson("app/charts/sunburst-chart/sunburst-chart.json");
  assertToolContent(content);
}
