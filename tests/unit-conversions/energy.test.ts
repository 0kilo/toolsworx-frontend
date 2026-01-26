import { convertEnergy } from "../../lib/categories/unit-conversions/logic";
import { assertApprox } from "../_helpers/assert";

export async function run() {
  const result = convertEnergy(1, "kWh", "Wh");
  assertApprox(result, 1000, 0.01);
}
