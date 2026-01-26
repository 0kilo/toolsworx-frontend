import { encodeBase64, decodeBase64 } from "../../lib/tools/logic/dev-tools/tool-base64";
import { assertEqual } from "../_helpers/assert";

export async function run() {
  const encoded = encodeBase64({ text: "hello" });
  const decoded = decodeBase64({ text: encoded.result });
  assertEqual(decoded.result, "hello");
}
