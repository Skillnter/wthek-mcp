#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createWthekMcpServer } from "./server";

/**
 * Main CLI entrypoint for the @wthek/mcp server.
 * Connects the MCP server over standard I/O for AI agents (Cursor, Claude, Antigravity).
 */
export const startServer = async (): Promise<void> => {
  const server = createWthekMcpServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
};

/* istanbul ignore next */
if (require.main === module) {
  startServer().catch((error: unknown) => {
    console.error("Fatal error starting @wthek/mcp server:", error);
    process.exit(1);
  });
}

