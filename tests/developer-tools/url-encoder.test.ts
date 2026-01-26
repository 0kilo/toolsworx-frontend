import { encodeURL, decodeURL } from "../../lib/tools/logic/dev-tools/tool-url";
import { assertEqual } from "../_helpers/assert";

export async function run() {
  const encoded = encodeURL({ text: "hello world" });
  const decoded = decodeURL({ text: encoded.encoded });
  assertEqual(decoded.decoded, "hello world");
}
