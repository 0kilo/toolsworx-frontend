import { calculateConcrete } from "../../lib/tools/logic/calculators/calculator-concrete";
import { assertApprox, assertEqual, assertTruthy } from "../_helpers/assert";

export async function run() {
  const result = calculateConcrete({ length: 10, width: 10, depth: 4 });
  assertTruthy(result.cubicYards);

}
