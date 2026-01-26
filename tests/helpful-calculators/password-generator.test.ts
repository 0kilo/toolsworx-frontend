import { generatePassword } from "../../lib/tools/logic/helpful-calculators/helper-password";
import { assertTruthy } from "../_helpers/assert";

export async function run() {
  const result = generatePassword({ length: 12, uppercase: true, lowercase: true, numbers: true, symbols: true });
  assertTruthy(result.password.length >= 12);
}
