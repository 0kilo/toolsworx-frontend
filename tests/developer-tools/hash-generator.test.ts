import { generateHash } from "../../lib/tools/logic/dev-tools/tool-hash";
import { assertEqual } from "../_helpers/assert";

export async function run() {
  const result = await generateHash({ text: "test", algorithm: "md5" });
  assertEqual(result.hash, "098f6bcd4621d373cade4e832627b4f6");
}
