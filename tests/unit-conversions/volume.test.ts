import { convertUnit } from "../../lib/tools/logic/unit-conversions/converter";
import { loadJson } from "../_helpers/content";
import { assertApprox } from "../_helpers/assert";

export async function run() {
  const content = loadJson("app/unit-conversions/volume/volume.json");
  const { result } = convertUnit({
    value: 1,
    fromUnit: "liter",
    toUnit: "gallon",
    units: content.units,
  });
  assertApprox(result, 0.26417, 0.01);
}
