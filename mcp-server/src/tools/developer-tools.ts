/**
 * Developer Tools for MCP
 *
 * Tools for developers including JSON formatter, Base64 encoder, UUID generator, etc.
 */

import { MCPTool } from "./conversion-tools.js";
import { randomBytes } from "crypto";

// Simple UUID v4 generator
function generateUUID(): string {
  const bytes = randomBytes(16);
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // Version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant 10

  return [
    bytes.subarray(0, 4).toString("hex"),
    bytes.subarray(4, 6).toString("hex"),
    bytes.subarray(6, 8).toString("hex"),
    bytes.subarray(8, 10).toString("hex"),
    bytes.subarray(10, 16).toString("hex"),
  ].join("-");
}

export const developerTools: MCPTool[] = [
  {
    name: "format-json",
    description: "Format, validate, and minify JSON data",
    inputSchema: {
      type: "object",
      properties: {
        jsonData: {
          type: "string",
          description: "JSON string to process",
        },
        operation: {
          type: "string",
          enum: ["format", "minify", "validate"],
          description: "Operation to perform",
        },
        indent: {
          type: "number",
          description: "Number of spaces for indentation (format only)",
          default: 2,
          minimum: 0,
          maximum: 8,
        },
      },
      required: ["jsonData", "operation"],
    },
    execute: async (args: {
      jsonData: string;
      operation: string;
      indent?: number;
    }) => {
      const { jsonData, operation, indent = 2 } = args;

      try {
        const parsed = JSON.parse(jsonData);

        switch (operation) {
          case "format":
            return {
              success: true,
              result: JSON.stringify(parsed, null, indent),
              operation: "format",
              valid: true,
            };

          case "minify":
            return {
              success: true,
              result: JSON.stringify(parsed),
              operation: "minify",
              valid: true,
            };

          case "validate":
            return {
              success: true,
              valid: true,
              message: "JSON is valid",
              operation: "validate",
            };

          default:
            throw new Error(`Unknown operation: ${operation}`);
        }
      } catch (error: any) {
        return {
          success: false,
          valid: false,
          error: error.message,
          operation,
        };
      }
    },
  },

  {
    name: "encode-base64",
    description: "Encode text to Base64",
    inputSchema: {
      type: "object",
      properties: {
        text: {
          type: "string",
          description: "Text to encode",
        },
      },
      required: ["text"],
    },
    execute: async (args: { text: string }) => {
      const encoded = Buffer.from(args.text, "utf-8").toString("base64");

      return {
        success: true,
        input: args.text,
        output: encoded,
        operation: "encode",
      };
    },
  },

  {
    name: "decode-base64",
    description: "Decode Base64 to text",
    inputSchema: {
      type: "object",
      properties: {
        base64: {
          type: "string",
          description: "Base64 string to decode",
        },
      },
      required: ["base64"],
    },
    execute: async (args: { base64: string }) => {
      try {
        const decoded = Buffer.from(args.base64, "base64").toString("utf-8");

        return {
          success: true,
          input: args.base64,
          output: decoded,
          operation: "decode",
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message,
          operation: "decode",
        };
      }
    },
  },

  {
    name: "generate-uuid",
    description: "Generate UUIDs (v4)",
    inputSchema: {
      type: "object",
      properties: {
        count: {
          type: "number",
          description: "Number of UUIDs to generate",
          default: 1,
          minimum: 1,
          maximum: 100,
        },
      },
      required: [],
    },
    execute: async (args: { count?: number }) => {
      const count = Math.min(Math.max(1, args.count || 1), 100);
      const uuids = Array.from({ length: count }, () => generateUUID());

      return {
        success: true,
        uuids,
        count: uuids.length,
      };
    },
  },

  {
    name: "encode-url",
    description: "Encode URL components",
    inputSchema: {
      type: "object",
      properties: {
        text: {
          type: "string",
          description: "Text to URL encode",
        },
      },
      required: ["text"],
    },
    execute: async (args: { text: string }) => {
      const encoded = encodeURIComponent(args.text);

      return {
        success: true,
        input: args.text,
        output: encoded,
        operation: "encode",
      };
    },
  },

  {
    name: "decode-url",
    description: "Decode URL components",
    inputSchema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "URL-encoded text to decode",
        },
      },
      required: ["url"],
    },
    execute: async (args: { url: string }) => {
      try {
        const decoded = decodeURIComponent(args.url);

        return {
          success: true,
          input: args.url,
          output: decoded,
          operation: "decode",
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message,
          operation: "decode",
        };
      }
    },
  },

  {
    name: "convert-timestamp",
    description: "Convert between Unix timestamps and human-readable dates",
    inputSchema: {
      type: "object",
      properties: {
        operation: {
          type: "string",
          enum: ["to_date", "to_timestamp"],
          description:
            "to_date (Unix timestamp to date), to_timestamp (date to Unix timestamp)",
        },
        value: {
          type: ["number", "string"],
          description: "Unix timestamp (number) or ISO date string",
        },
      },
      required: ["operation", "value"],
    },
    execute: async (args: { operation: string; value: number | string }) => {
      const { operation, value } = args;

      try {
        if (operation === "to_date") {
          const timestamp =
            typeof value === "number" ? value : parseInt(value as string);
          const date = new Date(timestamp * 1000);

          return {
            success: true,
            input: timestamp,
            output: {
              iso: date.toISOString(),
              local: date.toLocaleString(),
              utc: date.toUTCString(),
            },
            operation,
          };
        } else if (operation === "to_timestamp") {
          const date = new Date(value as string);
          const timestamp = Math.floor(date.getTime() / 1000);

          return {
            success: true,
            input: value,
            output: timestamp,
            operation,
          };
        } else {
          throw new Error(`Unknown operation: ${operation}`);
        }
      } catch (error: any) {
        return {
          success: false,
          error: error.message,
          operation,
        };
      }
    },
  },
];
