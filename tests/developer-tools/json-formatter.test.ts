import { formatJSON } from "../../lib/tools/logic/dev-tools/tool-json";
import { assertTruthy } from "../_helpers/assert";

export async function run() {
  const result = formatJSON({ text: "{\"a\":1}" });
  assertTruthy(result.result.includes("\n"));
}
