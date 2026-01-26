import { runImageFilterTest } from "../_helpers/api";
import { fixturePath } from "../_helpers/fixtures";

export async function run() {
  await runImageFilterTest(fixturePath("tests", "media", "sample.png"), "sepia", "jpeg", "jpeg");
}
