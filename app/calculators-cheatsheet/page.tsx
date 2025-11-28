import { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import { CheatSheet } from '@/components/shared/cheat-sheet'

export const metadata: Metadata = generateSEO({
  title: 'Calculator Formulas Cheat Sheet - Math & Finance Quick Reference',
  description: 'Essential calculator formulas for finance, geometry, statistics, and everyday math. Quick reference with examples and step-by-step calculations.',
  keywords: [
    'calculator formulas',
    'math formulas',
    'finance formulas',
    'loan calculator formula',
    'mortgage formula',
    'percentage formula',
    'geometry formulas',
    'statistics formulas'
  ],
  canonical: 'https://toolsworx.com/calculators-cheatsheet',
})

const cheatSheetContent = `
# Calculator Formulas Quick Reference

## Financial Calculations

### Loan & Mortgage Payments
**Monthly Payment Formula:**
$$M = P \\times \\frac{r(1+r)^n}{(1+r)^n - 1}$$

Where:
- $M$ = Monthly payment
- $P$ = Principal loan amount
- $r$ = Monthly interest rate (annual rate ÷ 12)
- $n$ = Total number of payments (years × 12)

**Example:** $200,000 loan at 5% APR for 30 years
- $P = 200,000$
- $r = 0.05 ÷ 12 = 0.004167$
- $n = 30 × 12 = 360$
- $M = 200,000 × \\frac{0.004167(1.004167)^{360}}{(1.004167)^{360} - 1} = \\$1,073.64$

### Compound Interest
**Formula:**
$$A = P(1 + \\frac{r}{n})^{nt}$$

Where:
- $A$ = Final amount
- $P$ = Principal
- $r$ = Annual interest rate
- $n$ = Compounding frequency per year
- $t$ = Time in years

**Example:** $1,000 at 6% compounded monthly for 5 years
$$A = 1000(1 + \\frac{0.06}{12})^{12 \\times 5} = \\$1,348.85$$

### Simple Interest
**Formula:**
$$I = P \\times r \\times t$$
$$A = P + I = P(1 + rt)$$

**Example:** $500 at 4% for 3 years
$$I = 500 × 0.04 × 3 = \\$60$$

## Percentage Calculations

### Basic Percentage Formulas
- **Percentage of a number:** $\\frac{P}{100} \\times N$
- **What percent is X of Y:** $\\frac{X}{Y} \\times 100$
- **Percentage change:** $\\frac{\\text{New} - \\text{Old}}{\\text{Old}} \\times 100$

**Examples:**
- 25% of 80: $\\frac{25}{100} \\times 80 = 20$
- 15 is what % of 60: $\\frac{15}{60} \\times 100 = 25\\%$
- Change from 50 to 65: $\\frac{65-50}{50} \\times 100 = 30\\%$ increase

### Tip Calculations
**Tip Amount:** $\\text{Bill} \\times \\frac{\\text{Tip %}}{100}$
**Total:** $\\text{Bill} + \\text{Tip}$

**Example:** $45 bill with 18% tip
- Tip: $45 × 0.18 = $8.10
- Total: $45 + $8.10 = $53.10

## Geometry Formulas

### Area Formulas
| Shape | Formula | Example |
|-------|---------|---------|
| Rectangle | $A = l \\times w$ | $A = 5 \\times 3 = 15$ |
| Square | $A = s^2$ | $A = 4^2 = 16$ |
| Triangle | $A = \\frac{1}{2}bh$ | $A = \\frac{1}{2} \\times 6 \\times 4 = 12$ |
| Circle | $A = \\pi r^2$ | $A = \\pi \\times 3^2 = 28.27$ |
| Trapezoid | $A = \\frac{1}{2}(b_1 + b_2)h$ | $A = \\frac{1}{2}(5 + 3) \\times 4 = 16$ |

### Perimeter/Circumference
| Shape | Formula | Example |
|-------|---------|---------|
| Rectangle | $P = 2(l + w)$ | $P = 2(5 + 3) = 16$ |
| Square | $P = 4s$ | $P = 4 \\times 4 = 16$ |
| Triangle | $P = a + b + c$ | $P = 3 + 4 + 5 = 12$ |
| Circle | $C = 2\\pi r$ | $C = 2\\pi \\times 3 = 18.85$ |

### Volume Formulas
| Shape | Formula | Example |
|-------|---------|---------|
| Cube | $V = s^3$ | $V = 3^3 = 27$ |
| Rectangular Prism | $V = l \\times w \\times h$ | $V = 4 \\times 3 \\times 2 = 24$ |
| Cylinder | $V = \\pi r^2 h$ | $V = \\pi \\times 2^2 \\times 5 = 62.83$ |
| Sphere | $V = \\frac{4}{3}\\pi r^3$ | $V = \\frac{4}{3}\\pi \\times 3^3 = 113.10$ |
| Cone | $V = \\frac{1}{3}\\pi r^2 h$ | $V = \\frac{1}{3}\\pi \\times 2^2 \\times 6 = 25.13$ |

## Statistics & Probability

### Mean, Median, Mode
- **Mean (Average):** $\\bar{x} = \\frac{\\sum x_i}{n}$
- **Median:** Middle value when data is ordered
- **Mode:** Most frequently occurring value

**Example:** Data set: 2, 4, 4, 6, 8, 10
- Mean: $(2+4+4+6+8+10) ÷ 6 = 5.67$
- Median: $(4+6) ÷ 2 = 5$
- Mode: $4$

### Standard Deviation
**Population:** $\\sigma = \\sqrt{\\frac{\\sum(x_i - \\mu)^2}{N}}$
**Sample:** $s = \\sqrt{\\frac{\\sum(x_i - \\bar{x})^2}{n-1}}$

### Probability
- **Basic Probability:** $P(A) = \\frac{\\text{Favorable outcomes}}{\\text{Total outcomes}}$
- **Complement:** $P(A') = 1 - P(A)$
- **Independent Events:** $P(A \\text{ and } B) = P(A) \\times P(B)$

## BMI & Health Calculations

### Body Mass Index
**Formula:** $\\text{BMI} = \\frac{\\text{weight (kg)}}{\\text{height (m)}^2}$

**Imperial:** $\\text{BMI} = \\frac{\\text{weight (lbs)} \\times 703}{\\text{height (inches)}^2}$

**Categories:**
- Underweight: BMI < 18.5
- Normal: 18.5 ≤ BMI < 25
- Overweight: 25 ≤ BMI < 30
- Obese: BMI ≥ 30

**Example:** 70 kg, 1.75 m tall
$$\\text{BMI} = \\frac{70}{1.75^2} = \\frac{70}{3.06} = 22.9$$

## Algebraic Formulas

### Quadratic Formula
$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

For equation: $ax^2 + bx + c = 0$

### Distance Formula
$$d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$$

### Slope Formula
$$m = \\frac{y_2 - y_1}{x_2 - x_1}$$

## Trigonometry

### Basic Ratios
- $\\sin \\theta = \\frac{\\text{opposite}}{\\text{hypotenuse}}$
- $\\cos \\theta = \\frac{\\text{adjacent}}{\\text{hypotenuse}}$
- $\\tan \\theta = \\frac{\\text{opposite}}{\\text{adjacent}}$

### Pythagorean Theorem
$$a^2 + b^2 = c^2$$

**Example:** Find hypotenuse with legs 3 and 4
$$c = \\sqrt{3^2 + 4^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5$$

## Quick Mental Math Tips

1. **Multiply by 11:** For 2-digit numbers, add digits and put sum in middle
   - $23 × 11 = 2(2+3)3 = 253$

2. **Square numbers ending in 5:** 
   - $25^2 = 2 × 3 = 6$, append 25 → $625$
   - $35^2 = 3 × 4 = 12$, append 25 → $1225$

3. **Percentage shortcuts:**
   - 10% = move decimal left one place
   - 5% = half of 10%
   - 15% = 10% + 5%

4. **Rule of 72:** Years to double = $\\frac{72}{\\text{interest rate}}$
   - At 6% interest: $\\frac{72}{6} = 12$ years to double
`

export default function CalculatorsCheatSheetPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <CheatSheet
            title="Calculator Formulas Cheat Sheet"
            description="Essential formulas for financial, mathematical, and statistical calculations"
            content={cheatSheetContent}
            category="calculators"
          />
        </div>
        <div className="lg:col-span-1">
        </div>
      </div>
    </div>
  )
}