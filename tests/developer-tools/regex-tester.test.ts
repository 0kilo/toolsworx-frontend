import { testRegex } from "../../lib/tools/logic/dev-tools/tool-regex";
import { assertEqual } from "../_helpers/assert";

export async function run() {
  const result = testRegex({ pattern: "t[a-z]+", flags: "g", testString: "test tool" });
  assertEqual(result.matches.length, 2);
}
