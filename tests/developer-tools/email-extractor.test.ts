import { extractEmails } from "../../lib/tools/logic/dev-tools/tool-email";
import { assertEqual } from "../_helpers/assert";

export async function run() {
  const result = extractEmails({ text: "Contact a@example.com and b@example.com" });
  assertEqual(result.emails.length, 2);
}
