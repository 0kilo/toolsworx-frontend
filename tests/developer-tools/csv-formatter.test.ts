import { formatCSV, csvToJSON } from "../../lib/tools/logic/dev-tools/tool-csv";
import { assertTruthy } from "../_helpers/assert";

export async function run() {
  const formatted = formatCSV({ csv: "a,b\n1,2" });
  const json = csvToJSON({ csv: "a,b\n1,2" });
  assertTruthy(formatted.formatted.includes("|"));
  assertTruthy(json.json.includes("\"a\""));
}
