# Official @wthek Extension – MCP Server for HTTP Error Diagnostics & Framework Recipes

**Local Model Context Protocol (MCP) server providing AI coding agents with error diagnostics, HTTP standards, and verified framework recipes.**

A lightweight, production-grade MCP server built for AI coding agents ([Claude Desktop][claude-desktop], [Cursor][cursor], [Antigravity][antigravity], etc.). Empowers agents to audit source code for error anti-patterns, resolve exact RFC status codes and headers, and generate verified `@wthek` error-handling setups for Express, Fastify, Hono, Koa, NestJS, and Restify.

> 💡 **What the HEK?! AI agents hallucinating error-handling packages or writing manual `res.status(500).json()` calls?** `wthek-mcp` runs locally alongside your AI editor over standard input/output (`stdio`), giving models deterministic tools to look up HTTP standards, generate copy-paste framework recipes, and audit source code before deploying to production.

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/skillnter/wthek-mcp/main.yml)
[![npm version](https://img.shields.io/npm/v/wthek-mcp?color=brightgreen)](https://www.npmjs.com/package/wthek-mcp)
[![GitHub license](https://img.shields.io/github/license/skillnter/wthek-mcp?color=brightgreen)](LICENSE)
[![GitHub Issues](https://img.shields.io/github/issues/Skillnter/wthek-mcp)](https://github.com/Skillnter/wthek-mcp/issues)
[![Codacy Badge](https://app.codacy.com/project/badge/Coverage/42a23a5676cf4712b18a802493ab2bac)](https://app.codacy.com/gh/Skillnter/wthek-mcp/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_coverage)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/42a23a5676cf4712b18a802493ab2bac)](https://app.codacy.com/gh/Skillnter/wthek-mcp/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Socket Badge](https://socket.dev/api/badge/npm/package/@wthek/mcp/1.0.0-beta.2)](https://socket.dev/npm/package/@wthek/mcp/overview/1.0.0-beta.2)
![npm](https://img.shields.io/npm/dy/wthek-mcp)
![NPM Type Definitions](https://img.shields.io/npm/types/wthek-mcp)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/wthek-mcp)](https://bundlephobia.com/package/wthek-mcp)
[![Github Sponsors](https://img.shields.io/badge/GitHub%20Sponsors-30363D?&logo=GitHub-Sponsors&logoColor=EA4AAA)](https://github.com/sponsors/Skillnter)
[![Open Collective](https://img.shields.io/badge/Open%20Collective-3385FF?logo=open-collective&logoColor=white)](https://opencollective.com/skillnter)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/skillnter)
[![Patreon](https://img.shields.io/badge/Patreon-F96854?logo=patreon&logoColor=white)](https://www.patreon.com/skillnter)
[![PayPal](https://img.shields.io/badge/PayPal-003087?logo=paypal&logoColor=fff)](https://www.paypal.me/skillnter)

---

## Features

- **Automated Anti-Pattern Auditing (`audit_error_handling`)** – Detects manual status mutations, swallowed exceptions, missing `headersSent` guards, and generic `throw new Error()` in routes.
- **RFC Standards & Header Lookup (`lookup_http_status`)** – Resolves exact RFC status code numbers, names, descriptions, standard headers (`WWW-Authenticate`, `Allow`, `Retry-After`), and import statements.
- **Hallucination-Free Recipes (`get_framework_recipe`)** – Supplies agents with verified, copy-paste error handling recipes for Express, Fastify, Hono, Koa, NestJS, and Restify paired with validation companion libraries (Zod, TypeBox, Valibot).
- **Zero Configuration via npx** – Ready to run out of the box via `npx wthek-mcp` in any MCP-compliant editor.
- **Standard Protocol Compliance** – Built on `@modelcontextprotocol/sdk` utilizing standard input/output (`stdio`) transport.
- **Standalone Programmatic Tools** – Tools can be consumed as an MCP server or imported directly as pure utility functions in custom Node.js agent pipelines.
- **100% Test Coverage & TypeScript-First** – Guaranteed reliability with strict typing, zero runtime exceptions, and full test coverage.

---

## Table of Contents

- [Quick Start: Configuring Your AI Agent](#quick-start-configuring-your-ai-agent)
  - [Claude Desktop](#claude-desktop-configuration)
  - [Cursor IDE](#cursor-configuration)
  - [Google Antigravity](#antigravity-configuration)
- [Available MCP Tools](#available-mcp-tools)
  - [1. `lookup_http_status`](#1-lookup_http_status)
  - [2. `get_framework_recipe`](#2-get_framework_recipe)
  - [3. `audit_error_handling`](#3-audit_error_handling)
- [Programmatic Usage](#programmatic-usage)
  - [Starting the MCP Server in Code](#starting-the-mcp-server-in-code)
  - [Direct Tool Execution](#direct-tool-execution)
- [API Reference](#api-reference)
  - [API Overview](#api-overview)
  - [Exported Constants & Interfaces](#exported-constants--interfaces)
- [Architecture Diagram](#architecture-diagram)
- [Security Considerations](#security-considerations)
- [Explore More WTHek Extensions](#explore-more-wthek-extensions)
- [People](#people)
- [Donations](#donations)
- [License](#license)

---

## Quick Start: Configuring Your AI Agent

No installation is necessary. Configure your agent to launch `wthek-mcp` via `npx`:

### Claude Desktop Configuration

Add to `claude_desktop_config.json`:

* **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
* **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "wthek": {
      "command": "npx",
      "args": ["wthek-mcp"]
    }
  }
}
```

### Cursor Configuration

Add to your project's `.cursor/mcp.json` or global Cursor settings:

```json
{
  "mcpServers": {
    "wthek": {
      "command": "npx",
      "args": ["wthek-mcp"]
    }
  }
}
```

### Antigravity Configuration

Add to your workspace or user MCP configuration file:

```json
{
  "mcpServers": {
    "wthek": {
      "command": "npx",
      "args": ["wthek-mcp"]
    }
  }
}
```

---

## Available MCP Tools

Once connected, your AI coding agent has direct access to the following 3 diagnostic tools:

### 1. `lookup_http_status`

Provides RFC metadata, recommended headers, and exact `http-error-kit` class imports for any HTTP status code or name.

**Input Arguments:**
* `query` (`string`, required): Status code number (e.g. `"404"`) or name (e.g. `"NOT_FOUND"`, `"too many requests"`).

**Example Agent Output:**

```json
{
  "className": "NotFoundError",
  "code": 404,
  "description": "Not Found",
  "exampleSnippet": "import { NotFoundError } from \"http-error-kit\";\n\nthrow new NotFoundError(\"Not Found\");",
  "isClientError": true,
  "isServerError": false,
  "name": "NOT_FOUND",
  "recommendedHeaders": [],
  "rfcStandardUrl": "https://httpstatuses.com/404"
}
```

---

### 2. `get_framework_recipe`

Retrieves a verified, production-ready `@wthek` error handling recipe for a specific web framework and optional validator.

**Input Arguments:**
* `framework` (`string`, required): Web framework name (`"express"`, `"fastify"`, `"hono"`, `"koa"`, `"nestjs"`, `"restify"`).
* `validator` (`string`, optional): Schema validation library (`"zod"`, `"typebox"`, `"valibot"`).

**Example Agent Output:**

```json
{
  "framework": "express",
  "validator": "zod",
  "packages": [
    "@wthek/express-middleware",
    "@wthek/zod-express-interceptor",
    "http-error-kit",
    "zod"
  ],
  "code": "import express from \"express\";\nimport { KitExpressMiddleware } from \"@wthek/express-middleware\";\nimport { KitZodExpressInterceptor } from \"@wthek/zod-express-interceptor\";\n\nconst app = express();\napp.use(express.json());\n\n// 1. Define application routes before error middleware\napp.get(\"/api/example\", (req, res) => {\n  res.json({ status: \"ok\" });\n});\n\n// 2. Intercept Zod validation errors and convert them to KitHttpErrors\napp.use(KitZodExpressInterceptor());\n\n// 3. Centralized error-handling middleware (must be registered last)\napp.use(KitExpressMiddleware({ handleUnknownErrors: true, log: true }));",
  "instructions": [
    "1. Install dependencies: npm install @wthek/express-middleware @wthek/zod-express-interceptor http-error-kit zod",
    "2. Copy and adapt the recipe code into your application entrypoint.",
    "3. Throw named error classes (e.g. NotFoundError, BadRequestError) inside route handlers."
  ]
}
```

---

### 3. `audit_error_handling`

Audits source code snippets for common error-handling anti-patterns and suggests `@wthek` best practices.

> ℹ️ **About the Heuristic Audit:**
> `audit_error_handling` is a fast, pattern-based heuristic diagnostic check designed to catch common pitfalls (such as manual status/json mutations, missing `res.headersSent` checks, and swallowed error logs). It is intentionally lightweight and non-intrusive—not a full AST-based static compiler or replacement for developer review or AI contextual reasoning.

**Input Arguments:**
* `code` (`string`, required): Source code snippet to audit.

**Example Agent Output:**

```json
{
  "codeSnippetLength": 72,
  "hasIssues": true,
  "issuesCount": 1,
  "summary": "Found 1 error-handling anti-pattern(s). Review suggestions to adopt @wthek best practices.",
  "issues": [
    {
      "description": "Direct manual response status and JSON payload mutation detected in route handler.",
      "rule": "no-manual-status-json",
      "severity": "high",
      "suggestion": "Throw structured http-error-kit classes (e.g. NotFoundError, BadRequestError) and delegate serialization to @wthek middleware."
    }
  ]
}
```

---

## Programmatic Usage

### Starting the MCP Server in Code

You can embed the server into custom Node.js agents, test suites, or orchestrators:

```typescript
import { createWthekMcpServer } from "wthek-mcp";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = createWthekMcpServer();
const transport = new StdioServerTransport();
await server.connect(transport);
```

### Direct Tool Execution

Consume the diagnostic helpers directly in your Node.js application without starting an MCP server:

```typescript
import {
  lookupHttpStatus,
  getFrameworkRecipe,
  auditErrorHandling,
} from "wthek-mcp";

// Look up status metadata
const statusInfo = lookupHttpStatus(401);
console.log(statusInfo.recommendedHeaders); // ["WWW-Authenticate"]

// Generate framework recipe
const recipe = getFrameworkRecipe("fastify", "zod");
console.log(recipe.packages); // ["@wthek/fastify-middleware", "http-error-kit", "@wthek/zod-transformer"]

// Audit source code
const report = auditErrorHandling(`
  app.get("/user", (req, res) => {
    res.status(500).json({ error: "Something broke" });
  });
`);
console.log(report.hasIssues); // true
console.log(report.issues[0].suggestion);
```

---

## API Reference

### API Overview

| Export | Kind | Description | Returns |
| :--- | :--- | :--- | :--- |
| `createWthekMcpServer()` | Function | Creates and configures the `McpServer` instance | `McpServer` |
| `lookupHttpStatus(query)` | Function | Looks up HTTP status code metadata, RFC links, and snippets | `IHttpStatusLookupResult` |
| `getFrameworkRecipe(framework, validator?)` | Function | Generates verified framework error-handling recipes | `IFrameworkRecipeResult` |
| `auditErrorHandling(code)` | Function | Scans code snippets for error anti-patterns | `IAuditResult` |
| `STATUS_CLASS_MAP` | Constant | Maps numeric status codes to `http-error-kit` class names | `Record<number, string>` |
| `STATUS_HEADERS_MAP` | Constant | Maps status codes to recommended protocol headers | `Record<number, string[]>` |
| `AUDIT_RULES` | Constant | Active rule definitions and regular expression patterns | `IAuditRuleDefinition[]` |
| `COMPANION_TRANSFORMERS` | Constant | Validation companion package mapping dictionary | `Record<string, string>` |

---

### Exported Constants & Interfaces

```typescript
import type {
  AuditSeverity,
  IAuditIssue,
  IAuditResult,
  IAuditRuleDefinition,
  IFrameworkRecipeResult,
  IHttpStatusLookupResult,
  SupportedFramework,
  SupportedValidator,
} from "wthek-mcp";

import {
  AUDIT_RULES,
  COMPANION_TRANSFORMERS,
  STATUS_CLASS_MAP,
  STATUS_HEADERS_MAP,
} from "wthek-mcp";
```

---

## Architecture Diagram

[![](https://mermaid.ink/img/pako:eNpVkttu2zAMhl-F0MXQAXa2nBtjGJY6SbNedEXSq82Dodm0Y8SWDEpKk6V599E5rdWVKP36SP7UXiQ6RRGIrNQvyUqShedJpIDX-Fckxt8h1GmhchjnqGwUqZuwlC5F-AShI6OJN2Nli5zkprC7j5H4DV98_-trJIxNCw03D8sfj_7iKeSrV7hj5otd4dqvkhqWSBskfhKpU0rj_jCoXsGz1qUBFk8KmSttbJEcz2DpCovHF3BeIatKrdeujlfW1rGx0jrzTjJhSY42zkhW-KJpHRMmRf2eM2URd1bYGIk0xSup0pI7v4pQpZc674BbhPBtMHkbTC_CEE5eLNDocoOm8WDGiRazEJaWM0hKDXxgXxeY6KriHJjCHGWK9L-HyZlyjwpJ2hPmnjHfjl7C4tiNgUwTk6bbmtAYD2aSfct2Hsy10h48orEPy1ardeVOz9zpRpbuwp03Y-eJ-k_SWiQFE7SY2EKrc52ZTKym5k8sXZ4zlK-aWoUncipSEVhy6IkKqZJNKPZNtkhwqRVbHvCWMHVbn5tf-4kuuWoRqQO_r6X6qXV1QZB2-UoEmSwNR65OucbmQ_AYr6fUWEahdsqKoDM8MkSwF1uOBr3WqHvbHw17vVG3N-h5YieCXrvVbbcHne5w1B91O_3uwRN_j0k_t26H_cM_L3j53g?type=png)](https://mermaid.live/edit#pako:eNptU11v2jAU_StXliqBlEAhUEoeptFQPrp1oMLTlmnyEkOsOnbkOKUU-O-7dsrYpPISX-ucc8-51xxIolJGQhLLjVC7JKPawHocS8Df6EdMRkUheEINVxLasGL6hScsJj_B9z_BHQLutVYaFklS6TKOZeMLNzNjivq6DedvJZ-l2skmUmvxO6cQocLnncnYcztPCp9ZtL9ROqfGMO3ANfzqCtaZZgy4NGyra0MFNdmO7ssaElnFY0zWSgmYUZkKpsHofRvtJ1lMjjDGbkY9JoWFPLGyEqZxcXTmL7UyKkGNNjwtI_hK99bJEe7P7DPAZftAYCrUbyoAJwGTS5QjTFAAUzra5OOMtSkut7CoTFEZWGW0YO8Bx25kU1SJqBCXDHbsicK5SOMBL52-B79yZujF3L0jz5D8sFp8822ybuu63k8tkDIPclaWdIuHlP5LnjjyHMn4AjgV_I2l76td0r1QNLUSL5yC22DLKNuk0Wz-n27CJc4lUrKsckzurqdO-gGlH6MlRIJjCpz8aA6jLR6tbiRoZc1F-MRsspE0HJ_ACzf7i8VZrVMX83NBPLLVPCWh0RXzCHbNqS3JwQJxnxnL8TmHeNQsrV79lOpnH3eLQ8H_xAn5BZXflcrPElpV24yEGypKrKoCB8XGnKKf_O-tZjJlOlKVNCTsBk6DhAfyitVNrzUMbvvDQa83DHo3PY_sSdjrtIJO56YbDIb9YdDtByePvLmm163bQf_0B_qIJ-A)

---

## Security Considerations

1. **Sandboxed Code Execution**:
   `audit_error_handling` operates purely via static regular expression matching on provided code strings. It never evaluates (`eval`), executes, or loads external code.
2. **Safe Transports**:
   `wthek-mcp` connects via local standard input/output (`stdio`), ensuring tools run locally on the developer's machine without exposing network ports or listening sockets.
3. **Defensive Input Validation**:
   Status code lookups and recipe parameters are normalized to prevent prototype pollution or unhandled runtime exceptions.

---

## Explore More WTHek Extensions

The WTHek ecosystem continues to grow with new extensions to simplify error handling across frameworks and AI pipelines. Stay updated with the latest tools that integrate seamlessly with `http-error-kit`:

**Check out the official list of extensions**: [Official Extensions List](https://github.com/Skillnter/http-error-kit/wiki/Official-Extensions-List)

- [`http-error-kit`][http-error-kit] – Core library offering structured, extensible HTTP error classes.
- [`http-response-status-code`][http-response-status-code] – Comprehensive HTTP status codes with descriptions.
- [`@wthek/mcp-error-formatter`][wthek-formatter] – Formats errors and tool results into standard MCP responses with `_meta` diagnostics.
- [`@wthek/express-middleware`][wthek-express] – Production-safe Express.js error middleware.
- [`@wthek/fastify-middleware`][wthek-fastify] – Fastify error-handling plugin.
- [`@wthek/hono-middleware`][wthek-hono] – Lightweight error handling middleware for Hono.
- [`@wthek/koa-middleware`][wthek-koa] – Robust error middleware for Koa.
- [`@wthek/nestjs-middleware`][wthek-nestjs] – NestJS global exception filter for `http-error-kit`.
- [`@wthek/restify-middleware`][wthek-restify] – Centralized error-handling for Restify.
- [`@wthek/zod-transformer`][wthek-zod] – Transform Zod errors into `http-error-kit` errors.
- [`@wthek/valibot-transformer`][wthek-valibot] – Transform Valibot validation errors into `http-error-kit` errors.
- [`@wthek/typebox-transformer`][wthek-typebox] – Transform TypeBox errors into `http-error-kit` errors.

---

## AI Agent Integration

When building with AI coding assistants (Claude Code, Cursor, GitHub Copilot, Antigravity, Devin), add the following directive to your project's `.cursorrules`, `.github/copilot-instructions.md`, or system prompt:

```markdown
### MCP Error Diagnostics & Recipe Rule
- Use `wthek-mcp` to resolve verified HTTP error handling recipes and RFC status codes.
- Before writing manual error responses or status codes, query `lookup_http_status` for standard headers and RFC class names.
- When scaffolding framework error middleware, retrieve copy-paste setups via `get_framework_recipe`.
- Audit route handlers with `audit_error_handling` to eliminate manual status mutations and generic unhandled exceptions.
```

---

## People

The original author of the project is [Himanshu Bansal][skillnter]

---

## Donations

**This is all voluntary work**, so if you want to support my efforts you can:

- [Buy Me A Coffee](https://www.buymeacoffee.com/skillnter)
- [PayPal](https://www.paypal.me/skillnter)
- [GitHub Sponsor](https://github.com/sponsors/Skillnter)
- [Patreon](https://www.patreon.com/skillnter)
- [Open Collective](https://opencollective.com/skillnter)

You can also use the following cryptocurrency addresses:

![BTC: bc1p22h4nsad5d8ketyhuvf0vyva6unttxwzzqvkty5r839as0mlclgs72d3mf](https://img.shields.io/badge/BTC-bc1p22h4nsad5d8ketyhuvf0vyva6unttxwzzqvkty5r839as0mlclgs72d3mf-brightgreen)

![ETH: 0x1D59a291391a3CE17C63D5dC50F258Dc0Ab62889](https://img.shields.io/badge/ETH-0x1D59a291391a3CE17C63D5dC50F258Dc0Ab62889-brightgreen)

![BNB: 0x1D59a291391a3CE17C63D5dC50F258Dc0Ab62889](https://img.shields.io/badge/BNB-0x1D59a291391a3CE17C63D5dC50F258Dc0Ab62889-brightgreen)

---

## License

`wthek-mcp` is open-sourced software licensed under the [MIT license](LICENSE) by [Himanshu Bansal][skillnter].

[skillnter]: https://github.com/Skillnter
[http-error-kit]: https://www.npmjs.com/package/http-error-kit
[http-response-status-code]: https://www.npmjs.com/package/http-response-status-code
[wthek-formatter]: https://www.npmjs.com/package/@wthek/mcp-error-formatter
[wthek-express]: https://www.npmjs.com/package/@wthek/express-middleware
[wthek-fastify]: https://www.npmjs.com/package/@wthek/fastify-middleware
[wthek-hono]: https://www.npmjs.com/package/@wthek/hono-middleware
[wthek-koa]: https://www.npmjs.com/package/@wthek/koa-middleware
[wthek-nestjs]: https://www.npmjs.com/package/@wthek/nestjs-middleware
[wthek-restify]: https://www.npmjs.com/package/@wthek/restify-middleware
[wthek-zod]: https://www.npmjs.com/package/@wthek/zod-transformer
[wthek-valibot]: https://www.npmjs.com/package/@wthek/valibot-transformer
[wthek-typebox]: https://www.npmjs.com/package/@wthek/typebox-transformer
[claude-desktop]: https://claude.ai/download
[cursor]: https://www.cursor.com/
[antigravity]: https://antigravity.google/
