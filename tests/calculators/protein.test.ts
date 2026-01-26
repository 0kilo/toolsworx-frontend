import { calculateProtein } from "../../lib/tools/logic/calculators/calculator-protein";
import { assertApprox, assertEqual, assertTruthy } from "../_helpers/assert";

export async function run() {
  const result = calculateProtein({ weight: 70, activity: "moderate", goal: "maintain" });
  assertTruthy(result.minProtein);
  assertTruthy(result.maxProtein);

}
