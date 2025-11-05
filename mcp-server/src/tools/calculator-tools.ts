/**
 * Calculator Tools for MCP
 *
 * Various calculators including BMI, mortgage, scientific calculations, etc.
 */

import { MCPTool } from "./conversion-tools.js";

export const calculatorTools: MCPTool[] = [
  {
    name: "calculate-bmi",
    description: "Calculate Body Mass Index (BMI) from height and weight",
    inputSchema: {
      type: "object",
      properties: {
        weight: {
          type: "number",
          description: "Weight value",
          minimum: 20,
          maximum: 500,
        },
        weightUnit: {
          type: "string",
          enum: ["kg", "lb"],
          description: "Unit of weight measurement",
        },
        height: {
          type: "number",
          description: "Height value",
          minimum: 50,
          maximum: 300,
        },
        heightUnit: {
          type: "string",
          enum: ["cm", "in"],
          description: "Unit of height measurement",
        },
      },
      required: ["weight", "weightUnit", "height", "heightUnit"],
    },
    execute: async (args: {
      weight: number;
      weightUnit: string;
      height: number;
      heightUnit: string;
    }) => {
      let { weight, height } = args;
      const { weightUnit, heightUnit } = args;

      // Convert to metric
      if (weightUnit === "lb") {
        weight = weight * 0.453592;
      }
      if (heightUnit === "in") {
        height = height * 2.54;
      }

      // Calculate BMI
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);

      // Determine category
      let category: string;
      let advice: string;

      if (bmi < 18.5) {
        category = "Underweight";
        advice = "Consider consulting a healthcare provider for guidance";
      } else if (bmi < 25) {
        category = "Normal weight";
        advice = "Maintain your healthy lifestyle";
      } else if (bmi < 30) {
        category = "Overweight";
        advice = "Consider a balanced diet and regular exercise";
      } else {
        category = "Obese";
        advice = "Consult a healthcare provider for personalized advice";
      }

      // Calculate healthy weight range
      const minHealthyWeight = 18.5 * heightInMeters * heightInMeters;
      const maxHealthyWeight = 24.9 * heightInMeters * heightInMeters;

      return {
        bmi: parseFloat(bmi.toFixed(1)),
        category,
        advice,
        healthyWeightRange: {
          min: parseFloat(minHealthyWeight.toFixed(1)),
          max: parseFloat(maxHealthyWeight.toFixed(1)),
          unit: "kg",
        },
        input: {
          weight: args.weight,
          weightUnit: args.weightUnit,
          height: args.height,
          heightUnit: args.heightUnit,
        },
      };
    },
  },

  {
    name: "calculate-mortgage",
    description: "Calculate monthly mortgage payments and total interest",
    inputSchema: {
      type: "object",
      properties: {
        homePrice: {
          type: "number",
          description: "Total price of the home",
          minimum: 1000,
        },
        downPayment: {
          type: "number",
          description: "Down payment amount",
          minimum: 0,
        },
        interestRate: {
          type: "number",
          description: "Annual interest rate (as percentage, e.g., 6.5 for 6.5%)",
          minimum: 0,
          maximum: 30,
        },
        loanTerm: {
          type: "number",
          description: "Loan term in years",
          minimum: 1,
          maximum: 50,
        },
      },
      required: ["homePrice", "downPayment", "interestRate", "loanTerm"],
    },
    execute: async (args: {
      homePrice: number;
      downPayment: number;
      interestRate: number;
      loanTerm: number;
    }) => {
      const { homePrice, downPayment, interestRate, loanTerm } = args;

      const principal = homePrice - downPayment;
      const monthlyRate = interestRate / 100 / 12;
      const numberOfPayments = loanTerm * 12;

      // Monthly payment formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
      const monthlyPayment =
        principal *
        (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

      const totalPayment = monthlyPayment * numberOfPayments;
      const totalInterest = totalPayment - principal;

      return {
        monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
        totalPayment: parseFloat(totalPayment.toFixed(2)),
        totalInterest: parseFloat(totalInterest.toFixed(2)),
        principal: parseFloat(principal.toFixed(2)),
        breakdown: {
          principalPercentage: parseFloat(
            ((principal / totalPayment) * 100).toFixed(2)
          ),
          interestPercentage: parseFloat(
            ((totalInterest / totalPayment) * 100).toFixed(2)
          ),
        },
        input: args,
      };
    },
  },

  {
    name: "calculate-percentage",
    description: "Calculate percentages, increases, and decreases",
    inputSchema: {
      type: "object",
      properties: {
        operation: {
          type: "string",
          enum: ["percentage_of", "is_what_percent", "percent_change"],
          description:
            "Type of calculation: percentage_of (X% of Y), is_what_percent (X is what % of Y), percent_change (% change from X to Y)",
        },
        value1: {
          type: "number",
          description: "First value",
        },
        value2: {
          type: "number",
          description: "Second value",
        },
      },
      required: ["operation", "value1", "value2"],
    },
    execute: async (args: {
      operation: string;
      value1: number;
      value2: number;
    }) => {
      const { operation, value1, value2 } = args;

      let result: number;
      let explanation: string;

      switch (operation) {
        case "percentage_of":
          // value1% of value2
          result = (value1 / 100) * value2;
          explanation = `${value1}% of ${value2} = ${result.toFixed(2)}`;
          break;

        case "is_what_percent":
          // value1 is what % of value2
          result = (value1 / value2) * 100;
          explanation = `${value1} is ${result.toFixed(2)}% of ${value2}`;
          break;

        case "percent_change":
          // % change from value1 to value2
          result = ((value2 - value1) / value1) * 100;
          const changeType = result >= 0 ? "increase" : "decrease";
          explanation = `${changeType} of ${Math.abs(result).toFixed(2)}% from ${value1} to ${value2}`;
          break;

        default:
          throw new Error(`Unknown operation: ${operation}`);
      }

      return {
        result: parseFloat(result.toFixed(2)),
        explanation,
        input: args,
      };
    },
  },
];
