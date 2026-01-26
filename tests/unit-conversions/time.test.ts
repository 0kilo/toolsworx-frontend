import { convertUnit } from "../../lib/tools/logic/unit-conversions/converter";
import { loadJson } from "../_helpers/content";
import { assertApprox } from "../_helpers/assert";

export async function run() {
  const content = loadJson("app/unit-conversions/time/time.json");
  const { result } = convertUnit({
    value: 2,
    fromUnit: "hour",
    toUnit: "minute",
    units: content.units,
  });
  assertApprox(result, 120, 0.001);
}
