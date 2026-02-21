export interface PackingChecklistInput {
  tripType: "travel" | "camping" | "motorcycle" | "backpacking"
  days: number
  rainy: boolean
}

export function buildPackingChecklist(input: PackingChecklistInput): string[] {
  const base = ["ID / Passport", "Phone + Charger", "Water Bottle", "First-aid basics"]
  const travel = ["Tickets / bookings", "Toiletries", "Power adapter"]
  const camping = ["Tent", "Sleeping bag", "Headlamp", "Stove"]
  const moto = ["Helmet", "Gloves", "Jacket", "Tool kit"]
  const backpack = ["Pack liner", "Trekking poles", "Water filter", "Map / GPX backup"]

  const byType =
    input.tripType === "travel"
      ? travel
      : input.tripType === "camping"
      ? camping
      : input.tripType === "motorcycle"
      ? moto
      : backpack

  const clothing = [`${Math.max(input.days, 1)}x socks`, `${Math.max(input.days, 1)}x underwear`]
  const rain = input.rainy ? ["Rain shell", "Dry bags"] : []

  return [...base, ...byType, ...clothing, ...rain]
}
