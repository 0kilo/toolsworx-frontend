import { convertTextCase } from "../../lib/tools/logic/dev-tools/tool-text-case";
import { assertEqual } from "../_helpers/assert";

export async function run() {
  const result = convertTextCase({ text: "hello world" });
  assertEqual(result.camelcase, "helloWorld");
}
