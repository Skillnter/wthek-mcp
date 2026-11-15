import * as RootExports from "../src";
import {
  AUDIT_RULES,
  COMPANION_TRANSFORMERS,
  STATUS_CLASS_MAP,
  STATUS_HEADERS_MAP,
  auditErrorHandling,
} from "../src";

describe("*** Testing auditErrorHandling ***", () => {
  it("should verify exported constants and all root exports", () => {
    expect(AUDIT_RULES).toHaveLength(6);
    expect(STATUS_CLASS_MAP[404]).toBe("NotFoundError");
    expect(STATUS_HEADERS_MAP[401]).toContain("WWW-Authenticate");
    expect(COMPANION_TRANSFORMERS.zod).toBe("@wthek/zod-transformer");

    // Verify all root barrel getters
    expect(RootExports.AUDIT_RULES).toBeDefined();
    expect(RootExports.COMPANION_TRANSFORMERS).toBeDefined();
    expect(RootExports.STATUS_CLASS_MAP).toBeDefined();
    expect(RootExports.STATUS_HEADERS_MAP).toBeDefined();
    expect(RootExports.auditErrorHandling).toBeDefined();
    expect(RootExports.getFrameworkRecipe).toBeDefined();
    expect(RootExports.lookupHttpStatus).toBeDefined();
    expect(RootExports.createWthekMcpServer).toBeDefined();
  });

  it("should report 0 issues for clean code", () => {
    const cleanCode = `
      import { NotFoundError } from "http-error-kit";

      app.get("/users/:id", async (req, res) => {
        const user = await db.find(req.params.id);
        if (!user) throw new NotFoundError("User not found");
        res.json(user);
      });
    `;

    const result = auditErrorHandling(cleanCode);
    expect(result.hasIssues).toBe(false);
    expect(result.issuesCount).toBe(0);
    expect(result.issues).toHaveLength(0);
    expect(result.summary).toContain("No common error handling anti-patterns detected");
  });

  it("should report 0 issues for normal non-error console logs", () => {
    const code = `
      app.get("/health", (req, res) => {
        console.log("Health check ping received at timestamp:", Date.now());
        res.json({ ok: true });
      });
    `;

    const result = auditErrorHandling(code);
    expect(result.hasIssues).toBe(false);
    expect(result.issuesCount).toBe(0);
  });

  it("should flag user snippet with new Error and console.log", () => {
    const userCode = `
      const { BadRequestError } = require("http-error-kit/http");

      console.log(
          new Error("abx")
      );
    `;

    const result = auditErrorHandling(userCode);
    expect(result.hasIssues).toBe(true);
    expect(result.issuesCount).toBe(2);

    const genericIssue = result.issues.find((i) => i.rule === "no-generic-error-throw");
    expect(genericIssue).toBeDefined();
    expect(genericIssue?.suggestion).toContain("http-error-kit");

    const swallowedIssue = result.issues.find((i) => i.rule === "no-swallowed-errors");
    expect(swallowedIssue).toBeDefined();
  });

  it("should flag manual res.status().json() calls and magic status codes", () => {
    const badCode = `
      app.get("/test", (req, res) => {
        res.status(500).json({ error: "DB failed" });
      });
    `;

    const result = auditErrorHandling(badCode);
    expect(result.hasIssues).toBe(true);

    const manualStatusIssue = result.issues.find((i) => i.rule === "no-manual-status-json");
    expect(manualStatusIssue).toBeDefined();
    expect(manualStatusIssue?.severity).toBe("high");

    const magicCodeIssue = result.issues.find((i) => i.rule === "no-magic-status-codes");
    expect(magicCodeIssue).toBeDefined();
    expect(magicCodeIssue?.severity).toBe("low");
  });

  it("should flag generic Error throws in route handlers", () => {
    const badCode = `
      app.post("/items", (req, res) => {
        throw new Error("Invalid payload");
      });
    `;

    const result = auditErrorHandling(badCode);
    expect(result.hasIssues).toBe(true);
    const issue = result.issues.find((i) => i.rule === "no-generic-error-throw");
    expect(issue).toBeDefined();
    expect(issue?.severity).toBe("medium");
  });

  it("should flag manual Fastify reply.code().send()", () => {
    const badCode = `
      fastify.get("/test", (req, reply) => {
        reply.code(400).send({ message: "Bad data" });
      });
    `;

    const result = auditErrorHandling(badCode);
    expect(result.hasIssues).toBe(true);
    const issue = result.issues.find((i) => i.rule === "no-manual-fastify-code-send");
    expect(issue).toBeDefined();
    expect(issue?.severity).toBe("high");
  });

  it("should flag Express custom error handler missing headersSent check", () => {
    const badCode = `
      app.use((err, req, res, next) => {
        res.status(500).send("Crash");
      });
    `;

    const result = auditErrorHandling(badCode);
    expect(result.hasIssues).toBe(true);
    const issue = result.issues.find((i) => i.rule === "require-headers-sent-check");
    expect(issue).toBeDefined();
    expect(issue?.severity).toBe("high");
  });

  it("should flag Express function error handler without headersSent", () => {
    const badCode = `
      app.use(function errorHandler(err, req, res, next) {
        res.send("Crash");
      });
    `;

    const result = auditErrorHandling(badCode);
    expect(result.hasIssues).toBe(true);
    const issue = result.issues.find((i) => i.rule === "require-headers-sent-check");
    expect(issue).toBeDefined();
  });

  it("should flag swallowed errors logged via console.error without throw", () => {
    const badCode = `
      try {
        await run();
      } catch (err) {
        console.error(err);
      }
    `;

    const result = auditErrorHandling(badCode);
    expect(result.hasIssues).toBe(true);
    const issue = result.issues.find((i) => i.rule === "no-swallowed-errors");
    expect(issue).toBeDefined();
    expect(issue?.severity).toBe("medium");
  });


  it("should not flag Express handler if res.headersSent check is present", () => {
    const code = `
      app.use((err, req, res, next) => {
        if (res.headersSent) {
          return next(err);
        }
        res.status(500).send("Handled");
      });
    `;

    const result = auditErrorHandling(code);
    const issue = result.issues.find((i) => i.rule === "require-headers-sent-check");
    expect(issue).toBeUndefined();
  });

  it("should not flag logged error if throw or next is present", () => {
    const code = `
      try {
        await run();
      } catch (err) {
        console.error(err);
        throw err;
      }
    `;

    const result = auditErrorHandling(code);
    const issue = result.issues.find((i) => i.rule === "no-swallowed-errors");
    expect(issue).toBeUndefined();
  });
});
