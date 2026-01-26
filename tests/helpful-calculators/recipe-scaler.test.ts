import { scaleRecipe } from "../../lib/tools/logic/helpful-calculators/helper-recipe";
import { assertEqual } from "../_helpers/assert";

export async function run() {
  const result = scaleRecipe({
    ingredients: [{ id: 1, name: "Flour", amount: "100", unit: "g" }],
    originalServings: 2,
    targetServings: 4,
  });
  assertEqual(result.scaledIngredients[0].amount, "200");
}
