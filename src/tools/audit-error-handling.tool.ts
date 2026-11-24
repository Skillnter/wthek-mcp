import { AUDIT_RULES } from "../constants";
import type { IAuditIssue, IAuditResult } from "../interfaces";

/**
 * Audits a source code snippet for common HTTP error handling anti-patterns.
 * Uses pattern heuristics to detect unhandled exceptions, raw status mutations,
 * missing headersSent checks, swallowed errors, and suggests @wthek improvements.
 *
 * @param {string} code - Source code string to audit.
 * @returns {IAuditResult} Diagnostic audit findings with actionable suggestions.
 *
 * @example
 * ```typescript
 * import { auditErrorHandling } from "@wthek/mcp";
 *
 * const report = auditErrorHandling(`
 *   app.get("/user", async (req, res) => {
 *     res.status(500).json({ error: "Something broke" });
 *   });
 * `);
 * console.log(report.issuesCount); // 2
 * ```
 */
export const auditErrorHandling = (code: string): IAuditResult => {
  const issues: IAuditIssue[] = [];

  for (const ruleDef of AUDIT_RULES) {
    if (ruleDef.isMatch(code)) {
      issues.push({
        description: ruleDef.description,
        rule: ruleDef.rule,
        severity: ruleDef.severity,
        suggestion: ruleDef.suggestion,
      });
    }
  }

  const issuesCount = issues.length;
  const hasIssues = issuesCount > 0;
  const summary = hasIssues
    ? `Found ${issuesCount} error-handling anti-pattern(s). Review suggestions to adopt @wthek best practices.`
    : "No common error handling anti-patterns detected in the provided code snippet.";

  return {
    codeSnippetLength: code.length,
    hasIssues,
    issues,
    issuesCount,
    summary,
  };
};
