import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  auditErrorHandling,
  getFrameworkRecipe,
  lookupHttpStatus,
} from "./tools";

/**
 * Creates and configures the @wthek Model Context Protocol (MCP) server instance.
 * Registers error diagnostic, HTTP lookup, and framework recipe tools for AI coding agents.
 *
 * @returns {McpServer} Initialized McpServer instance.
 *
 * @example
 * ```typescript
 * import { createWthekMcpServer } from "@wthek/mcp";
 * import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
 *
 * const server = createWthekMcpServer();
 * const transport = new StdioServerTransport();
 * await server.connect(transport);
 * ```
 */
export const createWthekMcpServer = (): McpServer => {
  const server = new McpServer({
    name: "wthek-mcp",
    version: "1.0.2",
  });

  (server as any).tool(
    "lookup_http_status",
    "Looks up detailed metadata, headers, RFC links, and code snippets for an HTTP status code.",
    {
      query: z
        .string()
        .describe(
          "HTTP status code (e.g. '404') or status name (e.g. 'NOT_FOUND', 'not found')"
        ),
    },
    async ({ query }: { query: string }) => {
      const result = lookupHttpStatus(query);
      return {
        content: [
          {
            text: JSON.stringify(result, null, 2),
            type: "text",
          },
        ],
      };
    }
  );

  (server as any).tool(
    "get_framework_recipe",
    "Retrieves a verified, production-ready @wthek setup recipe for a specified framework and validator.",
    {
      framework: z
        .string()
        .describe(
          "Web framework name: express, fastify, hono, koa, nestjs, restify"
        ),
      validator: z
        .string()
        .default("")
        .describe("Validation library: zod, valibot, typebox"),
    },
    async ({ framework, validator }: { framework: string; validator: string }) => {
      const result = getFrameworkRecipe(framework, validator);
      return {
        content: [
          {
            text: JSON.stringify(result, null, 2),
            type: "text",
          },
        ],
      };
    }
  );

  (server as any).tool(
    "audit_error_handling",
    "Performs a lightweight heuristic audit of a code snippet for common HTTP error handling anti-patterns (such as manual status/json mutations, unhandled raw errors, and missing headersSent guards). Note: This is a fast pattern-based diagnostic check, not a full AST compiler or AI replacement.",
    {
      code: z
        .string()
        .describe(
          "Source code snippet to audit for HTTP error anti-patterns"
        ),
    },
    async ({ code }: { code: string }) => {
      const result = auditErrorHandling(code);
      return {
        content: [
          {
            text: JSON.stringify(result, null, 2),
            type: "text",
          },
        ],
      };
    }
  );

  return server;
};
