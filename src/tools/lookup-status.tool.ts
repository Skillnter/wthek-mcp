import {
  getStatusCode,
  getStatusDescription,
  getStatusName,
  isClientError,
  isServerError,
} from "http-response-status-code";

import { STATUS_CLASS_MAP, STATUS_HEADERS_MAP } from "../constants";
import type { IHttpStatusLookupResult } from "../interfaces";

/**
 * Normalizes an input query into an HTTP status number.
 *
 * @param {number | string} query - Status code number or status code string.
 * @returns {number} The numeric status code.
 */
const resolveStatusCode = (query: number | string): number => {
  if (typeof query === "number") {
    return query;
  }

  const parsed = parseInt(query, 10);
  if (!isNaN(parsed)) {
    return parsed;
  }

  const normalized = query.trim().toUpperCase().replace(/\s+/g, "_");
  return getStatusCode(normalized);
};

/**
 * Looks up detailed information about an HTTP status code or status name.
 * Provides descriptions, headers, error class name, and usage examples for AI coding agents.
 *
 * @param {number | string} query - The numeric status code (e.g. 404, "404") or status name (e.g. "NOT_FOUND", "not found").
 * @returns {IHttpStatusLookupResult} Detailed metadata and code recipes for the status code.
 *
 * @example
 * ```typescript
 * import { lookupHttpStatus } from "@wthek/mcp";
 *
 * const info = lookupHttpStatus(404);
 * console.log(info.className); // "NotFoundError"
 * console.log(info.description); // "Not Found"
 * ```
 */
export const lookupHttpStatus = (
  query: number | string
): IHttpStatusLookupResult => {
  const code = resolveStatusCode(query);
  const name = getStatusName(code);
  const description = getStatusDescription(code);
  const className = STATUS_CLASS_MAP[code];
  const recommendedHeaders = STATUS_HEADERS_MAP[code] ?? [];

  const clientErr = isClientError(code);
  const serverErr = isServerError(code);

  const importTarget = className ?? "KitHttpError";
  const instantiation = className
    ? `throw new ${className}("${description}");`
    : `throw new KitHttpError(${code}, "${description}");`;

  const exampleSnippet = [
    `import { ${importTarget} } from "http-error-kit";`,
    "",
    instantiation,
  ].join("\n");

  return {
    className,
    code,
    description,
    exampleSnippet,
    isClientError: Boolean(clientErr),
    isServerError: Boolean(serverErr),
    name,
    recommendedHeaders,
    rfcStandardUrl: `https://httpstatuses.com/${code}`,
  };
};

