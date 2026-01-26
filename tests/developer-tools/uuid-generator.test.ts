import { generateUUIDs } from "../../lib/tools/logic/dev-tools/tool-uuid";
import { assertTruthy } from "../_helpers/assert";

export async function run() {
  const { uuids } = generateUUIDs({ count: 2 });
  assertTruthy(uuids.length === 2);
  assertTruthy(/^[0-9a-f-]{36}$/.test(uuids[0]));
}
