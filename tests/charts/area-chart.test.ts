import { validateAreaChartData } from "../../lib/tools/logic/charts/chart-area";
import { assertEqual } from "../_helpers/assert";

export async function run() {
  const error = validateAreaChartData({ title: "Test", data: [{ x: "A", y: 10 }] });
  assertEqual(error, null);
}
