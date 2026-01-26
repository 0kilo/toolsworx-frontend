import { decodeJWT } from "../../lib/tools/logic/dev-tools/tool-jwt";
import { assertEqual } from "../_helpers/assert";

export async function run() {
  const token = "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiIxMjMiLCJuYW1lIjoiVGVzdCJ9.sig";
  const decoded = decodeJWT({ token });
  assertEqual(decoded.payload.sub, "123");
}
