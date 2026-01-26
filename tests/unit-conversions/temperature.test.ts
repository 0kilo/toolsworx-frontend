import { convertTemperature } from "../../lib/tools/logic/unit-conversions/temperature";
import { assertApprox } from "../_helpers/assert";

export async function run() {
  const { result } = convertTemperature({ value: 0, fromUnit: "celsius", toUnit: "fahrenheit" });
  assertApprox(result, 32, 0.01);
}
