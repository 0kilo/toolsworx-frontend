import { calculateDate } from "../../lib/tools/logic/calculators/calculator-date";
import { assertApprox, assertEqual, assertTruthy } from "../_helpers/assert";

export async function run() {
  const result = calculateDate({ startDate: "2024-01-01", endDate: "2024-01-31", addDays: 10 });
  assertEqual(result.daysBetween, 30);
  assertTruthy(result.newDate);

}
