import { calculatePaint } from "../../lib/tools/logic/calculators/calculator-paint";
import { assertApprox, assertEqual, assertTruthy } from "../_helpers/assert";

export async function run() {
  const result = calculatePaint({ length: 10, width: 10, height: 8, coats: 2 });
  assertTruthy(result.totalGallons);

}
