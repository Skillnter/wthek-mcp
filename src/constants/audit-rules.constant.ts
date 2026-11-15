import type { IAuditRuleDefinition } from "../interfaces";

/**
 * Standard audit rules for HTTP error handling in Node.js applications.
 * @constant
 */
export const AUDIT_RULES: IAuditRuleDefinition[] = [
  {
    description:
      "Direct manual response status and JSON payload mutation detected in route handler.",
    isMatch: (code: string): boolean => {
      return /res\s*\.\s*(?:status|sendStatus)\s*\([\s\S]*?\)(?:\s*\.\s*(?:json|send|end)\s*\([\s\S]*?\))?/.test(
        code
      );
    },
    rule: "no-manual-status-json",
    severity: "high",
    suggestion:
      "Throw structured http-error-kit classes (e.g. NotFoundError, BadRequestError) and delegate serialization to @wthek middleware.",
  },
  {
    description:
      "Generic Error instantiated or thrown in application code without an HTTP status code.",
    isMatch: (code: string): boolean => {
      return /\b(?:throw\s+)?new\s+(?:Error|TypeError|RangeError|EvalError|ReferenceError)\s*\(|\bthrow\s+Error\s*\(/.test(
        code
      );
    },
    rule: "no-generic-error-throw",
    severity: "medium",
    suggestion:
      "Replace generic Error with named error classes from http-error-kit (e.g. new BadRequestError(), new InternalServerError()).",
  },
  {
    description:
      "Manual reply status and send mutation detected in Fastify handler.",
    isMatch: (code: string): boolean => {
      return /reply\s*\.\s*(?:status|code)\s*\([\s\S]*?\)\s*\.\s*send/.test(
        code
      );
    },
    rule: "no-manual-fastify-code-send",
    severity: "high",
    suggestion:
      "Register @wthek/fastify-middleware and throw http-error-kit errors directly in route handlers.",
  },
  {
    description:
      "Custom Express error middleware does not verify `res.headersSent` before writing response.",
    isMatch: (code: string): boolean => {
      const isErrorHandler =
        /(?:\((?:err|error)[^,)]*,\s*(?:req|request)[^,)]*,\s*(?:res|response)[^,)]*,\s*next[^)]*\)\s*=>|function\s*\w*\s*\((?:err|error)[^,)]*,\s*(?:req|request)[^,)]*,\s*(?:res|response)[^,)]*,\s*next[^)]*\))/.test(
          code
        );
      return isErrorHandler && !/headersSent/.test(code);
    },
    rule: "require-headers-sent-check",
    severity: "high",
    suggestion:
      "Delegate error handling to @wthek/express-middleware which handles headersSent safety automatically, or add `if (res.headersSent) return next(err);`.",
  },
  {
    description:
      "Error logged via console without propagation or centralized dispatch.",
    isMatch: (code: string): boolean => {
      const logsError =
        /console\.(error|warn)\s*\(/.test(code) ||
        /console\.log\s*\([\s\S]*?(?:new\s+\w*Error|\b(?:err|error|exception)\b)[\s\S]*?\)/.test(
          code
        );

      if (!logsError) {
        return false;
      }

      const hasPropagation =
        /throw\s+/.test(code) || /next\s*\(\s*(?:err|error|e)?\s*\)/.test(code);
      return !hasPropagation;
    },
    rule: "no-swallowed-errors",
    severity: "medium",
    suggestion:
      "Propagate the error to centralized middleware or throw a KitHttpError instead of swallowing it in console.",
  },
  {
    description:
      "Raw numeric HTTP status code used instead of type-safe constants.",
    isMatch: (code: string): boolean => {
      return (
        /res\s*\.\s*(?:status|sendStatus)\s*\(\s*(?:4\d\d|5\d\d)\s*\)/.test(
          code
        ) ||
        /reply\s*\.\s*(?:status|code)\s*\(\s*(?:4\d\d|5\d\d)\s*\)/.test(code)
      );
    },
    rule: "no-magic-status-codes",
    severity: "low",
    suggestion:
      "Import type-safe constants from http-response-status-code (e.g. NOT_FOUND, BAD_REQUEST, INTERNAL_SERVER_ERROR) instead of magic numbers.",
  },
];
