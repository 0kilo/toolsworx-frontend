import { runMediaConversionTest } from "../_helpers/api";
import { fixturePath } from "../_helpers/fixtures";

export async function run() {
  await runMediaConversionTest(fixturePath("tests", "media", "sample.png"), "webp", "webp");
}
