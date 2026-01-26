import { validateLineChartData } from "../../lib/tools/logic/charts/chart-line";
import { assertEqual } from "../_helpers/assert";

export async function run() {
  const error = validateLineChartData({ title: "Test", data: [{ x: 1, y: 2 }] });
  assertEqual(error, null);
}
