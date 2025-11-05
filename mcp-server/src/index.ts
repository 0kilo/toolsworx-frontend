#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { conversionTools } from "./tools/conversion-tools.js";
import { calculatorTools } from "./tools/calculator-tools.js";
import { developerTools } from "./tools/developer-tools.js";

/**
 * Convert-All MCP Server
 *
 * Provides conversion tools, calculators, and developer utilities
 * through the Model Context Protocol.
 *
 * Features:
 * - Unit conversions (length, weight, temperature, etc.)
 * - Calculators (BMI, mortgage, scientific, etc.)
 * - Developer tools (JSON formatter, Base64, UUID, etc.)
 * - OAuth authentication support
 */

class ConvertAllMCPServer {
  private server: Server;
  private tools: Map<string, any>;

  constructor() {
    this.server = new Server(
      {
        name: "convert-all",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Register all tools
    this.tools = new Map();
    this.registerTools();

    // Setup request handlers
    this.setupHandlers();
    this.setupErrorHandling();
  }

  private registerTools() {
    // Register conversion tools
    conversionTools.forEach((tool) => {
      this.tools.set(tool.name, tool);
    });

    // Register calculator tools
    calculatorTools.forEach((tool) => {
      this.tools.set(tool.name, tool);
    });

    // Register developer tools
    developerTools.forEach((tool) => {
      this.tools.set(tool.name, tool);
    });

    console.error(`Registered ${this.tools.size} tools`);
  }

  private setupHandlers() {
    // Handle tool listing
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools = Array.from(this.tools.values()).map((tool) => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      }));

      return { tools };
    });

    // Handle tool execution
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      const tool = this.tools.get(name);
      if (!tool) {
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${name}`
        );
      }

      try {
        const result = await tool.execute(args);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";

        throw new McpError(
          ErrorCode.InternalError,
          `Tool execution failed: ${errorMessage}`
        );
      }
    });
  }

  private setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error("[MCP Error]", error);
    };

    process.on("SIGINT", async () => {
      console.error("Received SIGINT, shutting down...");
      await this.server.close();
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      console.error("Received SIGTERM, shutting down...");
      await this.server.close();
      process.exit(0);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Convert-All MCP Server running on stdio");
  }
}

// Start server
const server = new ConvertAllMCPServer();
server.run().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
