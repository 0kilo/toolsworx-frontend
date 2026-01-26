import { extractEmails } from "../../lib/tools/logic/dev-tools/tool-email";
import { extractURLs } from "../../lib/tools/logic/dev-tools/tool-url";
import { convertTextCase } from "../../lib/tools/logic/dev-tools/tool-text-case";
import { assertEqual } from "../_helpers/assert";

export async function run() {
  const emails = extractEmails({ text: "a@example.com b@example.com" });
  const urls = extractURLs({ text: "https://example.com" });
  const cases = convertTextCase({ text: "hello world" });
  assertEqual(emails.emails.length, 2);
  assertEqual(urls.urls.length, 1);
  assertEqual(cases.uppercase, "HELLO WORLD");
}
