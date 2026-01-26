import { calculatePercentage } from "../../lib/tools/logic/calculators/calculator-percentage";
import { assertApprox, assertEqual, assertTruthy } from "../_helpers/assert";

export async function run() {
  const result = calculatePercentage({ value: 200, percentage: 10, total: 500 });
  assertEqual(result.percentageOf, 20);
  assertEqual(result.valueAsPercentage, 40);

}
