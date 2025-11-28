import { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import { CheatSheet } from '@/components/shared/cheat-sheet'

export const metadata: Metadata = generateSEO({
  title: 'Unit Conversions Cheat Sheet - Quick Reference Guide',
  description: 'Complete unit conversion formulas and examples for length, mass, temperature, volume, and more. Quick reference with SI base units and conversion factors.',
  keywords: [
    'unit conversion cheat sheet',
    'conversion formulas',
    'SI units',
    'metric conversion',
    'imperial to metric',
    'temperature conversion formula',
    'length conversion',
    'mass conversion'
  ],
  canonical: 'https://toolsworx.com/unit-conversions-cheatsheet',
})

const cheatSheetContent = `
# Unit Conversions Quick Reference

## SI Base Units

| Quantity | Unit | Symbol |
|----------|------|--------|
| Length | meter | m |
| Mass | kilogram | kg |
| Time | second | s |
| Electric current | ampere | A |
| Temperature | kelvin | K |
| Amount of substance | mole | mol |
| Luminous intensity | candela | cd |

## Length Conversions

### Metric System
- **1 kilometer (km)** = 1,000 meters
- **1 meter (m)** = 100 centimeters = 1,000 millimeters
- **1 centimeter (cm)** = 10 millimeters

### Imperial System
- **1 mile** = 5,280 feet = 1,760 yards
- **1 yard** = 3 feet = 36 inches
- **1 foot** = 12 inches

### Metric ↔ Imperial
- **1 meter** = 3.28084 feet = 39.3701 inches
- **1 kilometer** = 0.621371 miles
- **1 inch** = 2.54 centimeters
- **1 foot** = 0.3048 meters
- **1 mile** = 1.60934 kilometers

**Example:** Convert 5 miles to kilometers
$$5 \\text{ miles} \\times 1.60934 = 8.0467 \\text{ km}$$

## Mass/Weight Conversions

### Metric System
- **1 kilogram (kg)** = 1,000 grams
- **1 gram (g)** = 1,000 milligrams
- **1 metric ton** = 1,000 kilograms

### Imperial System
- **1 pound (lb)** = 16 ounces
- **1 ton (US)** = 2,000 pounds

### Metric ↔ Imperial
- **1 kilogram** = 2.20462 pounds
- **1 pound** = 0.453592 kilograms
- **1 ounce** = 28.3495 grams

**Example:** Convert 150 pounds to kilograms
$$150 \\text{ lbs} \\times 0.453592 = 68.04 \\text{ kg}$$

## Temperature Conversions

### Formulas
- **Celsius to Fahrenheit:** $F = \\frac{9}{5}C + 32$
- **Fahrenheit to Celsius:** $C = \\frac{5}{9}(F - 32)$
- **Celsius to Kelvin:** $K = C + 273.15$
- **Kelvin to Celsius:** $C = K - 273.15$

### Reference Points
| Description | Celsius | Fahrenheit | Kelvin |
|-------------|---------|------------|--------|
| Absolute Zero | -273.15°C | -459.67°F | 0 K |
| Water Freezing | 0°C | 32°F | 273.15 K |
| Room Temperature | ~20°C | ~68°F | ~293 K |
| Body Temperature | 37°C | 98.6°F | 310.15 K |
| Water Boiling | 100°C | 212°F | 373.15 K |

**Example:** Convert 25°C to Fahrenheit
$$F = \\frac{9}{5} \\times 25 + 32 = 45 + 32 = 77°F$$

## Volume Conversions

### Metric System
- **1 liter (L)** = 1,000 milliliters (mL)
- **1 cubic meter (m³)** = 1,000 liters

### Imperial System
- **1 gallon (US)** = 4 quarts = 8 pints = 16 cups
- **1 quart** = 2 pints = 4 cups
- **1 pint** = 2 cups = 16 fluid ounces

### Metric ↔ Imperial
- **1 liter** = 0.264172 gallons (US) = 1.05669 quarts
- **1 gallon (US)** = 3.78541 liters
- **1 fluid ounce** = 29.5735 milliliters

**Example:** Convert 2 gallons to liters
$$2 \\text{ gallons} \\times 3.78541 = 7.57 \\text{ L}$$

## Area Conversions

### Metric System
- **1 square kilometer (km²)** = 1,000,000 m² = 100 hectares
- **1 hectare** = 10,000 m²
- **1 square meter (m²)** = 10,000 cm²

### Imperial System
- **1 square mile** = 640 acres
- **1 acre** = 43,560 square feet
- **1 square yard** = 9 square feet

### Metric ↔ Imperial
- **1 square meter** = 10.7639 square feet
- **1 square kilometer** = 0.386102 square miles
- **1 hectare** = 2.47105 acres

## Speed Conversions

### Common Conversions
- **1 m/s** = 3.6 km/h = 2.237 mph
- **1 km/h** = 0.277778 m/s = 0.621371 mph
- **1 mph** = 1.60934 km/h = 0.44704 m/s

**Example:** Convert 60 mph to km/h
$$60 \\text{ mph} \\times 1.60934 = 96.56 \\text{ km/h}$$

## Energy Conversions

### Common Units
- **1 joule (J)** = 1 N⋅m = 1 W⋅s
- **1 calorie** = 4.184 joules
- **1 kilowatt-hour (kWh)** = 3.6 × 10⁶ joules
- **1 BTU** = 1,055 joules

## Pressure Conversions

### Common Units
- **1 pascal (Pa)** = 1 N/m²
- **1 atmosphere (atm)** = 101,325 Pa = 760 mmHg
- **1 bar** = 100,000 Pa = 0.987 atm
- **1 psi** = 6,895 Pa

## Energy Conversions

### Common Energy Units
- **1 joule (J)** = 1 N⋅m = 1 W⋅s (SI base unit)
- **1 kilojoule (kJ)** = 1,000 joules
- **1 calorie (cal)** = 4.184 joules
- **1 kilocalorie (kcal)** = 4,184 joules = 1.163 Wh
- **1 watt-hour (Wh)** = 3,600 joules
- **1 kilowatt-hour (kWh)** = 3.6 × 10⁶ joules
- **1 BTU** = 1,055 joules
- **1 electron volt (eV)** = 1.602 × 10⁻¹⁹ joules

### Energy Scale Examples
- **Chemical bond energy:** ~1-10 eV
- **Food calorie:** 1 kcal = 4,184 J
- **Household electricity:** measured in kWh
- **Gasoline energy density:** ~44 MJ/kg

**Example:** Convert 1 kWh to calories
$$1 \\text{ kWh} = 3.6 \\times 10^6 \\text{ J} \\div 4.184 = 860,421 \\text{ cal}$$

## Space-Time Distance Conversions

### Astronomical Units
- **1 Astronomical Unit (AU)** = 149,597,870.7 km (Earth-Sun distance)
- **1 light-year (ly)** = 9.461 × 10¹⁵ m = 63,241 AU
- **1 parsec (pc)** = 3.086 × 10¹⁶ m = 3.26 ly = 206,265 AU
- **1 light-second** = 299,792,458 m
- **1 light-minute** = 17,987,547,480 m

### Cosmic Scale Examples
- **Earth to Moon:** ~1.3 light-seconds
- **Earth to Sun:** 1 AU = 8.3 light-minutes
- **Solar System diameter:** ~100 AU
- **Nearest star:** 4.24 light-years
- **Milky Way diameter:** ~100,000 light-years
- **Nearest galaxy:** 2.5 million light-years

**Example:** Convert 1 parsec to light-years
$$1 \\text{ pc} = 3.26 \\text{ ly}$$

## Quick Conversion Tips

1. **Temperature:** Remember 0°C = 32°F and 100°C = 212°F
2. **Length:** 1 inch ≈ 2.5 cm, 1 foot ≈ 30 cm, 1 meter ≈ 3.3 feet
3. **Mass:** 1 kg ≈ 2.2 lbs, 1 lb ≈ 450 g
4. **Volume:** 1 liter ≈ 1 quart, 1 gallon ≈ 4 liters
5. **Speed:** 100 km/h ≈ 60 mph
6. **Energy:** 1 kWh ≈ 860,000 cal, 1 BTU ≈ 1,055 J
7. **Astronomy:** 1 ly ≈ 63,000 AU, 1 pc ≈ 3.26 ly
`

export default function UnitConversionsCheatSheetPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <CheatSheet
            title="Unit Conversions Cheat Sheet"
            description="Quick reference guide for common unit conversions with formulas and examples"
            content={cheatSheetContent}
            category="unit-conversions"
          />
        </div>
        <div className="lg:col-span-1">
        </div>
      </div>
    </div>
  )
}