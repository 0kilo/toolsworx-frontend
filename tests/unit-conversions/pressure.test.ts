import { convertUnit } from "../../lib/tools/logic/unit-conversions/converter";
import { loadJson } from "../_helpers/content";
import { assertApprox } from "../_helpers/assert";

export async function run() {
  const content = loadJson("app/unit-conversions/pressure/pressure.json");
  const { result } = convertUnit({
    value: 1,
    fromUnit: "bar",
    toUnit: "psi",
    units: content.units,
  });
  assertApprox(result, 14.5038, 0.1);
}
