import { runAudioFilterTest } from "../_helpers/api";
import { fixturePath } from "../_helpers/fixtures";

export async function run() {
  await runAudioFilterTest(fixturePath("tests", "media", "sample.wav"), "normalize", "mp3", "mp3");
}
