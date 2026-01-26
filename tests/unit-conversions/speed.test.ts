import { convertUnit } from "../../lib/tools/logic/unit-conversions/converter";
import { loadJson } from "../_helpers/content";
import { assertApprox } from "../_helpers/assert";

export async function run() {
  const content = loadJson("app/unit-conversions/speed/speed.json");
  const { result } = convertUnit({
    value: 60,
    fromUnit: "mph",
    toUnit: "kph",
    units: content.units,
  });
  assertApprox(result, 96.5606, 0.05);
}
