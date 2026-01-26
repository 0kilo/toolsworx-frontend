import { convertUnit } from "../../lib/tools/logic/unit-conversions/converter";
import { loadJson } from "../_helpers/content";
import { assertApprox } from "../_helpers/assert";

export async function run() {
  const content = loadJson("app/unit-conversions/data/data.json");
  const { result } = convertUnit({
    value: 1,
    fromUnit: "GB",
    toUnit: "MB",
    units: content.units,
  });
  assertApprox(result, 1000, 0.01);
}
