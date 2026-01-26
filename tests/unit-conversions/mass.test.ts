import { convertUnit } from "../../lib/tools/logic/unit-conversions/converter";
import { loadJson } from "../_helpers/content";
import { assertApprox } from "../_helpers/assert";

export async function run() {
  const content = loadJson("app/unit-conversions/mass/mass.json");
  const { result } = convertUnit({
    value: 1,
    fromUnit: "kilogram",
    toUnit: "pound",
    units: content.units,
  });
  assertApprox(result, 2.20462, 0.01);
}
