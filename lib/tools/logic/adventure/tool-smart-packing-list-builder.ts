export interface SmartPackingInput {
  tripType: "city" | "outdoor" | "motorcycle"
  days: number
  tempC: number
  rainy: boolean
}

export function buildSmartPackingList(input: SmartPackingInput): string[] {
  const list: string[] = ["Phone + charger", "ID / wallet", `${Math.max(input.days, 1)}x base clothing`]
  if (input.days >= 5) list.push("Laundry sheet / sink wash soap")

  if (input.tempC < 10) list.push("Warm mid-layer", "Thermal socks")
  if (input.tempC > 28) list.push("Sun hat", "Electrolyte packets")
  if (input.rainy) list.push("Rain jacket", "Waterproof bag")

  if (input.tripType === "city") list.push("Walking shoes", "Daypack")
  if (input.tripType === "outdoor") list.push("Headlamp", "First-aid kit", "Multi-tool")
  if (input.tripType === "motorcycle") list.push("Riding gloves", "Armor layer", "Visor cleaner")

  return list
}
