import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createWthekMcpServer } from "../src";
import { startServer } from "../src/bin";

describe("*** Testing createWthekMcpServer and tools ***", () => {
  it("should create and return an McpServer instance with registered tools", () => {
    const server = createWthekMcpServer();
    expect(server).toBeDefined();
    expect(typeof server.connect).toBe("function");

    const tools = (server as any)._registeredTools;
    expect(tools).toHaveProperty("lookup_http_status");
    expect(tools).toHaveProperty("get_framework_recipe");
    expect(tools).toHaveProperty("audit_error_handling");
  });

  it("should execute lookup_http_status tool handler", async () => {
    const server = createWthekMcpServer();
    const handler = (server as any)._registeredTools["lookup_http_status"].handler;
    const result = await handler({ query: "404" });

    expect(result.content).toBeDefined();
    expect(result.content[0].type).toBe("text");
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.code).toBe(404);
    expect(parsed.className).toBe("NotFoundError");
  });

  it("should execute get_framework_recipe tool handler", async () => {
    const server = createWthekMcpServer();
    const handler = (server as any)._registeredTools["get_framework_recipe"].handler;
    const result = await handler({ framework: "express", validator: "zod" });

    expect(result.content).toBeDefined();
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.framework).toBe("express");
    expect(parsed.validator).toBe("zod");
  });

  it("should execute audit_error_handling tool handler", async () => {
    const server = createWthekMcpServer();
    const handler = (server as any)._registeredTools["audit_error_handling"].handler;
    const result = await handler({
      code: 'res.status(404).json({ error: "not found" });',
    });

    expect(result.content).toBeDefined();
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.issuesCount).toBeGreaterThan(0);
  });

  it("should execute startServer and connect over transport", async () => {
    const connectSpy = jest
      .spyOn(McpServer.prototype, "connect")
      .mockImplementation(async () => Promise.resolve());

    await startServer();

    expect(connectSpy).toHaveBeenCalledTimes(1);
    connectSpy.mockRestore();
  });
});
