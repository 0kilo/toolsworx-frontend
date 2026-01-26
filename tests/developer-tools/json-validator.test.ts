import { validateJSON } from "../../lib/tools/logic/dev-tools/tool-json";
import { assertEqual } from "../_helpers/assert";

export async function run() {
  const result = validateJSON({ text: "{\"a\":1}" });
  assertEqual(result.isValid, true);
}
