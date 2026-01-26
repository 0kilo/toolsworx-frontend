import { calculateBMI } from "../../lib/tools/logic/calculators/calculator-bmi";
import { assertApprox, assertEqual, assertTruthy } from "../_helpers/assert";

export async function run() {
  const result = calculateBMI({ weight: 70, weightUnit: "kg", height: 175, heightUnit: "cm" });
  assertApprox(result.bmi, 22.9, 0.2);
  assertEqual(result.category, "Normal weight");
  assertTruthy(result.advice);

}
