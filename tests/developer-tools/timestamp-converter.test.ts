import { timestampToDate, dateToTimestamp } from "../../lib/tools/logic/dev-tools/tool-timestamp";
import { assertEqual } from "../_helpers/assert";

export async function run() {
  const ts = dateToTimestamp({ date: "2024-01-01T00:00:00Z" });
  const date = timestampToDate({ timestamp: ts.timestamp });
  assertEqual(date.date.startsWith("2024-01-01"), true);
}
