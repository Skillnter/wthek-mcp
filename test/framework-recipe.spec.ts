import { getFrameworkRecipe } from "../src";

describe("*** Testing getFrameworkRecipe ***", () => {
  it("should return Express recipe with Zod interceptor", () => {
    const recipe = getFrameworkRecipe("express", "zod");

    expect(recipe.framework).toBe("express");
    expect(recipe.validator).toBe("zod");
    expect(recipe.packages).toContain("@wthek/express-middleware");
    expect(recipe.packages).toContain("@wthek/zod-express-interceptor");
    expect(recipe.code).toContain("KitZodExpressInterceptor");
    expect(recipe.code).toContain("KitExpressMiddleware");
  });

  it("should return Express recipe with TypeBox and Valibot", () => {
    const typebox = getFrameworkRecipe("express", "typebox");
    expect(typebox.packages).toContain("@wthek/typebox-transformer");

    const valibot = getFrameworkRecipe("express", "valibot");
    expect(valibot.packages).toContain("@wthek/valibot-transformer");
  });

  it("should return Fastify recipe with validators", () => {
    const fastify = getFrameworkRecipe("fastify", "zod");
    expect(fastify.framework).toBe("fastify");
    expect(fastify.packages).toContain("@wthek/fastify-middleware");
    expect(fastify.packages).toContain("@wthek/zod-transformer");
    expect(fastify.code).toContain("KitFastifyMiddleware");

    const fastifyTb = getFrameworkRecipe("fastify", "typebox");
    expect(fastifyTb.packages).toContain("@wthek/typebox-transformer");

    const fastifyVb = getFrameworkRecipe("fastify", "valibot");
    expect(fastifyVb.packages).toContain("@wthek/valibot-transformer");

    const fastifyNoVal = getFrameworkRecipe("fastify");
    expect(fastifyNoVal.packages).toEqual(["@wthek/fastify-middleware", "http-error-kit"]);
  });

  it("should return Hono recipe with validators", () => {
    const hono = getFrameworkRecipe("hono", "typebox");
    expect(hono.framework).toBe("hono");
    expect(hono.packages).toContain("@wthek/hono-middleware");
    expect(hono.packages).toContain("@wthek/typebox-transformer");
    expect(hono.code).toContain("KitHonoMiddleware");

    const honoZod = getFrameworkRecipe("hono", "zod");
    expect(honoZod.packages).toContain("@wthek/zod-transformer");

    const honoVb = getFrameworkRecipe("hono", "valibot");
    expect(honoVb.packages).toContain("@wthek/valibot-transformer");
  });

  it("should return Koa recipe with validators", () => {
    const koa = getFrameworkRecipe("koa", "valibot");
    expect(koa.framework).toBe("koa");
    expect(koa.packages).toContain("@wthek/koa-middleware");
    expect(koa.packages).toContain("@wthek/valibot-transformer");
    expect(koa.code).toContain("KitKoaMiddleware");

    const koaZod = getFrameworkRecipe("koa", "zod");
    expect(koaZod.packages).toContain("@wthek/zod-transformer");

    const koaTb = getFrameworkRecipe("koa", "typebox");
    expect(koaTb.packages).toContain("@wthek/typebox-transformer");
  });

  it("should return NestJS recipe with validators", () => {
    const nest = getFrameworkRecipe("nestjs", "zod");
    expect(nest.framework).toBe("nestjs");
    expect(nest.packages).toContain("@wthek/nestjs-middleware");
    expect(nest.packages).toContain("@wthek/zod-transformer");
    expect(nest.code).toContain("KitNestJsMiddleware");

    const nestTb = getFrameworkRecipe("nest", "typebox");
    expect(nestTb.framework).toBe("nestjs");
    expect(nestTb.packages).toContain("@wthek/typebox-transformer");

    const nestVb = getFrameworkRecipe("nestjs", "valibot");
    expect(nestVb.packages).toContain("@wthek/valibot-transformer");
  });

  it("should return Restify recipe with validators", () => {
    const restify = getFrameworkRecipe("restify", "zod");
    expect(restify.framework).toBe("restify");
    expect(restify.packages).toContain("@wthek/restify-middleware");
    expect(restify.packages).toContain("@wthek/zod-transformer");
    expect(restify.code).toContain("KitRestifyMiddleware");

    const restifyTb = getFrameworkRecipe("restify", "typebox");
    expect(restifyTb.packages).toContain("@wthek/typebox-transformer");

    const restifyVb = getFrameworkRecipe("restify", "valibot");
    expect(restifyVb.packages).toContain("@wthek/valibot-transformer");
  });

  it("should fallback to Express when unknown framework is provided", () => {
    const fallback = getFrameworkRecipe("unknown-fw");
    expect(fallback.framework).toBe("express");
    expect(fallback.packages).toEqual(["@wthek/express-middleware", "http-error-kit"]);
  });

  it("should handle unknown validator gracefully without transformer", () => {
    const recipe = getFrameworkRecipe("express", "unknown-validator");
    expect(recipe.validator).toBeUndefined();
    expect(recipe.packages).toEqual(["@wthek/express-middleware", "http-error-kit"]);
  });
});
