import { convertUnit } from "../../lib/tools/logic/unit-conversions/converter";
import { loadJson } from "../_helpers/content";
import { assertApprox } from "../_helpers/assert";

export async function run() {
  const content = loadJson("app/unit-conversions/length/length.json");
  const { result } = convertUnit({
    value: 1,
    fromUnit: "meter",
    toUnit: "foot",
    units: content.units,
  });
  assertApprox(result, 3.28084, 0.01);
}
