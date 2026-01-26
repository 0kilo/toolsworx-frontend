import { calculateCalories } from "../../lib/tools/logic/calculators/calculator-calorie";
import { assertApprox, assertEqual, assertTruthy } from "../_helpers/assert";

export async function run() {
  const result = calculateCalories({ age: 30, gender: "male", weight: 70, height: 175, activity: "moderate" });
  assertTruthy(result.dailyCalories);
  assertTruthy(result.weightLoss);
  assertTruthy(result.weightGain);

}
