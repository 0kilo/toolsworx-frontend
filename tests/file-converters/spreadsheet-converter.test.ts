import { runFileConversionTest } from "../_helpers/api";
import { fixturePath } from "../_helpers/fixtures";

export async function run() {
  await runFileConversionTest(fixturePath("tests", "docs", "TEST.xlsx"), "csv", "csv");
}
