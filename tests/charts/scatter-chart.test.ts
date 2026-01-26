import { validateScatterChartData } from "../../lib/tools/logic/charts/chart-scatter";
import { assertEqual } from "../_helpers/assert";

export async function run() {
  const error = validateScatterChartData({ title: "Test", data: [{ x: 1, y: 2 }] });
  assertEqual(error, null);
}
