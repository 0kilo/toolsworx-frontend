import { convertCrypto } from "../../lib/tools/logic/helpful-calculators/helper-crypto";
import { assertEqual } from "../_helpers/assert";

export async function run() {
  const result = convertCrypto({ amount: 2, fromCrypto: "BTC", toCurrency: "USD", cryptoPrice: 30000 });
  assertEqual(result.result, 60000);
}
