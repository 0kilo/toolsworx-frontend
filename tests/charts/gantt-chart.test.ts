import { loadJson, assertToolContent } from "../_helpers/content";

export async function run() {
  const content = loadJson("app/charts/gantt-chart/gantt-chart.json");
  assertToolContent(content);
}
