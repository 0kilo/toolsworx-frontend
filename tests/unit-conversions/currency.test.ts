import { convertCurrency } from "../../lib/tools/logic/unit-conversions/currency";
import { assertApprox } from "../_helpers/assert";

export async function run() {
  const { result } = convertCurrency({
    value: 100,
    fromCurrency: "USD",
    toCurrency: "EUR",
    rates: { EUR: 0.9 },
  });
  assertApprox(result, 90, 0.01);
}
