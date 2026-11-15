import { lookupHttpStatus } from "../src";

describe("*** Testing lookupHttpStatus ***", () => {
  it("should look up status code by numeric code", () => {
    const result = lookupHttpStatus(404);

    expect(result.code).toBe(404);
    expect(result.name).toBe("NOT_FOUND");
    expect(result.description).toBe("Not Found");
    expect(result.className).toBe("NotFoundError");
    expect(result.isClientError).toBe(true);
    expect(result.isServerError).toBe(false);
    expect(result.rfcStandardUrl).toBe("https://httpstatuses.com/404");
    expect(result.exampleSnippet).toContain("import { NotFoundError } from \"http-error-kit\";");
    expect(result.exampleSnippet).toContain("throw new NotFoundError(\"Not Found\");");
  });

  it("should look up status code by string numeric code", () => {
    const result = lookupHttpStatus("401");

    expect(result.code).toBe(401);
    expect(result.name).toBe("UNAUTHORIZED");
    expect(result.className).toBe("UnauthorizedError");
    expect(result.recommendedHeaders).toEqual(["WWW-Authenticate"]);
    expect(result.isClientError).toBe(true);
  });

  it("should look up status code by uppercase and lowercase name", () => {
    const resUpper = lookupHttpStatus("TOO_MANY_REQUESTS");
    expect(resUpper.code).toBe(429);
    expect(resUpper.className).toBe("TooManyRequestsError");
    expect(resUpper.recommendedHeaders).toEqual(["Retry-After"]);

    const resLower = lookupHttpStatus("internal server error");
    expect(resLower.code).toBe(500);
    expect(resLower.className).toBe("InternalServerError");
    expect(resLower.isServerError).toBe(true);
  });

  it("should handle custom / non-standard status code without named class", () => {
    const result = lookupHttpStatus(200);

    expect(result.code).toBe(200);
    expect(result.className).toBeUndefined();
    expect(result.isClientError).toBe(false);
    expect(result.isServerError).toBe(false);
    expect(result.exampleSnippet).toContain("import { KitHttpError } from \"http-error-kit\";");
    expect(result.exampleSnippet).toContain("throw new KitHttpError(200, \"OK\");");
  });
});

