/**
 * Known protocol headers recommended for specific HTTP status codes.
 * @constant
 */
export const STATUS_HEADERS_MAP: Record<number, string[]> = {
  401: ["WWW-Authenticate"],
  405: ["Allow"],
  407: ["Proxy-Authenticate"],
  429: ["Retry-After"],
  503: ["Retry-After"],
};

