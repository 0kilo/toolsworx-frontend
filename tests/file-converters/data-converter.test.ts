import { formatJSON } from "../../lib/tools/logic/dev-tools/tool-json";
import { formatXML } from "../../lib/tools/logic/dev-tools/tool-xml";
import { csvToJSON } from "../../lib/tools/logic/dev-tools/tool-csv";
import { assertTruthy } from "../_helpers/assert";

export async function run() {
  const jsonResult = formatJSON({ text: "{\"a\":1}" });
  assertTruthy(jsonResult.result);
  const xmlResult = formatXML({ xml: "<root><item>1</item></root>" });
  assertTruthy(xmlResult.formatted);
  const csvResult = csvToJSON({ csv: "a,b\n1,2" });
  assertTruthy(csvResult.json);
}
