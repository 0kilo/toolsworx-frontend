import { formatXML, minifyXML } from "../../lib/tools/logic/dev-tools/tool-xml";
import { assertTruthy } from "../_helpers/assert";

export async function run() {
  const formatted = formatXML({ xml: "<root><item>1</item></root>" });
  const minified = minifyXML({ xml: formatted.formatted });
  assertTruthy(formatted.formatted.includes("\n"));
  assertTruthy(minified.minified.includes("<root>"));
}
