import { Calculator, Heart, DollarSign, Percent, TrendingUp, LineChart } from "lucide-react"
import { ConverterMetadata } from "@/types/converter"

/**
 * Calculators Registry
 * All calculator tools are registered here
 */
export const calculatorTools: ConverterMetadata[] = [
  {
    id: "graphing-calculator",
    title: "Graphing Calculator",
    description: "Plot mathematical functions with symbolic expressions",
    category: "calculator",
    icon: LineChart,
    href: "/calculators/graphing",
    keywords: ["graphing", "calculator", "plot", "function", "graph", "symbolic", "math"],
    popular: true,
  },
  {
    id: "scientific-calculator",
    title: "Scientific Calculator",
    description: "Advanced calculator with scientific functions",
    category: "calculator",
    icon: Calculator,
    href: "/calculators/scientific",
    keywords: ["scientific", "calculator", "math", "trigonometry", "logarithm", "advanced"],
    popular: true,
  },
  {
    id: "bmi-calculator",
    title: "BMI Calculator",
    description: "Calculate your Body Mass Index",
    category: "calculator",
    icon: Heart,
    href: "/calculators/bmi",
    keywords: ["bmi", "body mass index", "health", "weight", "fitness"],
    popular: true,
  },
  {
    id: "mortgage-calculator",
    title: "Mortgage Calculator",
    description: "Calculate monthly mortgage payments",
    category: "calculator",
    icon: DollarSign,
    href: "/calculators/mortgage",
    keywords: ["mortgage", "loan", "home", "payment", "interest", "finance"],
    popular: true,
  },
  {
    id: "loan-calculator",
    title: "Loan Calculator",
    description: "Calculate loan payments and total interest",
    category: "calculator",
    icon: DollarSign,
    href: "/calculators/loan",
    keywords: ["loan", "payment", "interest", "finance", "debt"],
    popular: true,
  },
  {
    id: "tip-calculator",
    title: "Tip Calculator",
    description: "Calculate tips and split bills",
    category: "calculator",
    icon: Percent,
    href: "/calculators/tip",
    keywords: ["tip", "gratuity", "restaurant", "bill", "split"],
    popular: true,
  },
  {
    id: "percentage-calculator",
    title: "Percentage Calculator",
    description: "Calculate percentages, increases, and decreases",
    category: "calculator",
    icon: Percent,
    href: "/calculators/percentage",
    keywords: ["percentage", "percent", "increase", "decrease", "discount"],
    popular: false,
  },
]
