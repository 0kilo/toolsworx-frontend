import { convertSpaceTime } from "../../lib/categories/unit-conversions/logic";
import { assertApprox } from "../_helpers/assert";

export async function run() {
  const result = convertSpaceTime(1, "AU", "km");
  assertApprox(result, 149597870.7, 1);
}
