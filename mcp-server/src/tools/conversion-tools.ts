/**
 * Conversion Tools for MCP
 *
 * Unit conversion tools for length, weight, temperature, etc.
 */

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required: string[];
  };
  execute: (args: any) => Promise<any>;
}

// Conversion factors
const LENGTH_TO_METERS: Record<string, number> = {
  m: 1,
  km: 1000,
  cm: 0.01,
  mm: 0.001,
  ft: 0.3048,
  in: 0.0254,
  mi: 1609.34,
  yd: 0.9144,
};

const WEIGHT_TO_KG: Record<string, number> = {
  kg: 1,
  g: 0.001,
  mg: 0.000001,
  lb: 0.453592,
  oz: 0.0283495,
  ton: 1000,
  stone: 6.35029,
};

export const conversionTools: MCPTool[] = [
  {
    name: "convert-length",
    description: "Convert between different units of length (meters, feet, inches, kilometers, miles, etc.)",
    inputSchema: {
      type: "object",
      properties: {
        value: {
          type: "number",
          description: "The numeric value to convert",
        },
        fromUnit: {
          type: "string",
          enum: ["m", "km", "cm", "mm", "ft", "in", "mi", "yd"],
          description: "The unit to convert from",
        },
        toUnit: {
          type: "string",
          enum: ["m", "km", "cm", "mm", "ft", "in", "mi", "yd"],
          description: "The unit to convert to",
        },
      },
      required: ["value", "fromUnit", "toUnit"],
    },
    execute: async (args: { value: number; fromUnit: string; toUnit: string }) => {
      const { value, fromUnit, toUnit } = args;

      // Convert to meters first
      const meters = value * LENGTH_TO_METERS[fromUnit];
      // Convert to target unit
      const result = meters / LENGTH_TO_METERS[toUnit];

      return {
        input: {
          value,
          unit: fromUnit,
        },
        output: {
          value: parseFloat(result.toFixed(6)),
          unit: toUnit,
        },
        formula: `${value} ${fromUnit} = ${result.toFixed(6)} ${toUnit}`,
      };
    },
  },

  {
    name: "convert-weight",
    description: "Convert between different units of weight/mass",
    inputSchema: {
      type: "object",
      properties: {
        value: {
          type: "number",
          description: "The numeric value to convert",
        },
        fromUnit: {
          type: "string",
          enum: ["kg", "g", "mg", "lb", "oz", "ton", "stone"],
          description: "The unit to convert from",
        },
        toUnit: {
          type: "string",
          enum: ["kg", "g", "mg", "lb", "oz", "ton", "stone"],
          description: "The unit to convert to",
        },
      },
      required: ["value", "fromUnit", "toUnit"],
    },
    execute: async (args: { value: number; fromUnit: string; toUnit: string }) => {
      const { value, fromUnit, toUnit } = args;

      const kg = value * WEIGHT_TO_KG[fromUnit];
      const result = kg / WEIGHT_TO_KG[toUnit];

      return {
        input: {
          value,
          unit: fromUnit,
        },
        output: {
          value: parseFloat(result.toFixed(6)),
          unit: toUnit,
        },
        formula: `${value} ${fromUnit} = ${result.toFixed(6)} ${toUnit}`,
      };
    },
  },

  {
    name: "convert-temperature",
    description: "Convert between Celsius, Fahrenheit, and Kelvin",
    inputSchema: {
      type: "object",
      properties: {
        value: {
          type: "number",
          description: "The temperature value to convert",
        },
        fromUnit: {
          type: "string",
          enum: ["celsius", "fahrenheit", "kelvin"],
          description: "The unit to convert from",
        },
        toUnit: {
          type: "string",
          enum: ["celsius", "fahrenheit", "kelvin"],
          description: "The unit to convert to",
        },
      },
      required: ["value", "fromUnit", "toUnit"],
    },
    execute: async (args: { value: number; fromUnit: string; toUnit: string }) => {
      const { value, fromUnit, toUnit } = args;

      // Convert to Celsius first
      let celsius: number;
      switch (fromUnit) {
        case "celsius":
          celsius = value;
          break;
        case "fahrenheit":
          celsius = (value - 32) * (5 / 9);
          break;
        case "kelvin":
          celsius = value - 273.15;
          break;
        default:
          throw new Error(`Unknown unit: ${fromUnit}`);
      }

      // Convert from Celsius to target unit
      let result: number;
      switch (toUnit) {
        case "celsius":
          result = celsius;
          break;
        case "fahrenheit":
          result = celsius * (9 / 5) + 32;
          break;
        case "kelvin":
          result = celsius + 273.15;
          break;
        default:
          throw new Error(`Unknown unit: ${toUnit}`);
      }

      return {
        input: {
          value,
          unit: fromUnit,
        },
        output: {
          value: parseFloat(result.toFixed(2)),
          unit: toUnit,
        },
        formula: `${value}° ${fromUnit} = ${result.toFixed(2)}° ${toUnit}`,
      };
    },
  },
];
