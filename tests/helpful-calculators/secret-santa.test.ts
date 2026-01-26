import { generateSecretSanta } from "../../lib/tools/logic/helpful-calculators/helper-secret-santa";
import { assertEqual } from "../_helpers/assert";

export async function run() {
  const result = generateSecretSanta({
    participants: [
      { id: 1, name: "A", email: "a@example.com" },
      { id: 2, name: "B", email: "b@example.com" },
      { id: 3, name: "C", email: "c@example.com" },
    ],
  });
  assertEqual(result.assignments.length, 3);
}
