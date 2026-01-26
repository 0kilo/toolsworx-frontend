import { calculateTimeRemaining } from "../../lib/tools/logic/helpful-calculators/helper-holiday";
import { assertEqual } from "../_helpers/assert";

export async function run() {
  const now = new Date("2024-01-01T00:00:00Z");
  const target = new Date("2024-01-02T00:00:00Z");
  const result = calculateTimeRemaining(target, now);
  assertEqual(result.days, 1);
}
