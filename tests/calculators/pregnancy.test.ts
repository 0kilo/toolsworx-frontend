import { calculatePregnancy } from "../../lib/tools/logic/calculators/calculator-pregnancy";
import { assertApprox, assertEqual, assertTruthy } from "../_helpers/assert";

export async function run() {
  const result = calculatePregnancy({ lastPeriod: "2024-01-01" });
  assertTruthy(result.dueDate);
  assertTruthy(result.weeksPregnant);
  assertTruthy(result.trimester);

}
