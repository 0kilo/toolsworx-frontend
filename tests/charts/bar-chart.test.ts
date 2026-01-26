import { validateBarChartData } from "../../lib/tools/logic/charts/chart-bar";
import { assertEqual } from "../_helpers/assert";

export async function run() {
  const error = validateBarChartData({ title: "Test", data: [{ label: "A", value: 5 }] });
  assertEqual(error, null);
}
