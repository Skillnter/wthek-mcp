/**
 * Severity level of an error handling audit finding.
 */
export type AuditSeverity = "high" | "low" | "medium";

/**
 * A single finding detected during an error handling audit.
 * @interface
 */
export interface IAuditIssue {
  description: string;
  rule: string;
  severity: AuditSeverity;
  suggestion: string;
}

/**
 * Result returned by the error handling audit tool.
 * @interface
 */
export interface IAuditResult {
  codeSnippetLength: number;
  hasIssues: boolean;
  issues: IAuditIssue[];
  issuesCount: number;
  summary: string;
}

/**
 * Audit rule definition for detecting error handling anti-patterns.
 * @interface
 */
export interface IAuditRuleDefinition {
  description: string;
  isMatch: (code: string) => boolean;
  rule: string;
  severity: AuditSeverity;
  suggestion: string;
}
