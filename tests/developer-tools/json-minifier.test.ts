import { minifyJSON } from "../../lib/tools/logic/dev-tools/tool-json";
import { assertEqual } from "../_helpers/assert";

export async function run() {
  const result = minifyJSON({ text: "{\n  \"a\": 1\n}" });
  assertEqual(result.result, "{\"a\":1}");
}
