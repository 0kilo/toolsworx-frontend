import { extractURLs } from "../../lib/tools/logic/dev-tools/tool-url";
import { assertEqual } from "../_helpers/assert";

export async function run() {
  const result = extractURLs({ text: "Visit https://example.com and http://test.com" });
  assertEqual(result.urls.length, 2);
}
