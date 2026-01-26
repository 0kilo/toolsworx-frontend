import { calculateTip } from "../../lib/tools/logic/calculators/calculator-tip";
import { assertApprox, assertEqual, assertTruthy } from "../_helpers/assert";

export async function run() {
  const result = calculateTip({ billAmount: 100, tipPercentage: 20, numberOfPeople: 4 });
  assertEqual(result.tipAmount, 20);
  assertEqual(result.perPersonTotal, 30);

}
