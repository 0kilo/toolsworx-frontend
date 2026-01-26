import { calculateLoan } from "../../lib/tools/logic/calculators/calculator-loan";
import { assertApprox, assertEqual, assertTruthy } from "../_helpers/assert";

export async function run() {
  const result = calculateLoan({ principal: 200000, interestRate: 5, loanTerm: 30 });
  assertApprox(result.monthlyPayment, 1073.64, 1);
  assertApprox(result.totalPaid, 386511.57, 100);

}
