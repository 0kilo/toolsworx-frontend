import { calculateFlooring } from "../../lib/tools/logic/calculators/calculator-flooring";
import { assertApprox, assertEqual, assertTruthy } from "../_helpers/assert";

export async function run() {
  const result = calculateFlooring({ length: 12, width: 10, waste: 10 });
  assertTruthy(result.roomArea);
  assertTruthy(result.totalArea);

}
