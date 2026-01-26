import { validatePieChartData } from "../../lib/tools/logic/charts/chart-pie";
import { assertEqual } from "../_helpers/assert";

export async function run() {
  const error = validatePieChartData({ title: "Test", data: [{ label: "A", value: 50 }] });
  assertEqual(error, null);
}
