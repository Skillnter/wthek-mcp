import { COMPANION_TRANSFORMERS } from "../constants";
import type {
  IFrameworkRecipeResult,
  SupportedFramework,
  SupportedValidator,
} from "../interfaces";

/**
 * Resolves companion validation transformer package name for a given validator.
 */
const resolveCompanionPackage = (
  validator?: SupportedValidator
): string | undefined => {
  return validator ? COMPANION_TRANSFORMERS[validator] : undefined;
};

/**
 * Resolves packages and middleware code for Express.
 */
const getExpressRecipe = (
  validator?: SupportedValidator
): { code: string; packages: string[] } => {
  if (validator === "zod") {
    return {
      code: [
        'import express from "express";',
        'import { KitExpressMiddleware } from "@wthek/express-middleware";',
        'import { KitZodExpressInterceptor } from "@wthek/zod-express-interceptor";',
        "",
        "const app = express();",
        "app.use(express.json());",
        "",
        "// 1. Define application routes before error middleware",
        'app.get("/api/example", (req, res) => {',
        '  res.json({ status: "ok" });',
        "});",
        "",
        "// 2. Intercept Zod validation errors and convert them to KitHttpErrors",
        "app.use(KitZodExpressInterceptor());",
        "",
        "// 3. Centralized error-handling middleware (must be registered last)",
        "app.use(KitExpressMiddleware({ handleUnknownErrors: true, log: true }));",
      ].join("\n"),
      packages: [
        "@wthek/express-middleware",
        "@wthek/zod-express-interceptor",
        "http-error-kit",
        "zod",
      ],
    };
  }

  const companionPkg = resolveCompanionPackage(validator);
  const packages = ["@wthek/express-middleware", "http-error-kit"];
  if (companionPkg) {
    packages.push(companionPkg);
  }

  return {
    code: [
      'import express from "express";',
      'import { KitExpressMiddleware } from "@wthek/express-middleware";',
      "",
      "const app = express();",
      "app.use(express.json());",
      "",
      "// 1. Define application routes before error middleware",
      'app.get("/api/example", (req, res) => {',
      '  res.json({ status: "ok" });',
      "});",
      "",
      "// 2. Centralized error-handling middleware (must be registered last)",
      "app.use(KitExpressMiddleware({ handleUnknownErrors: true, log: true }));",
    ].join("\n"),
    packages,
  };
};

/**
 * Resolves packages and middleware code for Fastify.
 */
const getFastifyRecipe = (
  validator?: SupportedValidator
): { code: string; packages: string[] } => {
  const companionPkg = resolveCompanionPackage(validator);

  const packages = ["@wthek/fastify-middleware", "http-error-kit"];
  if (companionPkg) {
    packages.push(companionPkg);
  }

  return {
    code: [
      'import Fastify from "fastify";',
      'import { KitFastifyMiddleware } from "@wthek/fastify-middleware";',
      "",
      "const app = Fastify();",
      "",
      "// Register @wthek centralized error handler on the Fastify instance",
      "KitFastifyMiddleware(app, { handleUnknownErrors: true, log: true });",
    ].join("\n"),
    packages,
  };
};

/**
 * Resolves packages and middleware code for Hono.
 */
const getHonoRecipe = (
  validator?: SupportedValidator
): { code: string; packages: string[] } => {
  const companionPkg = resolveCompanionPackage(validator);

  const packages = ["@wthek/hono-middleware", "http-error-kit"];
  if (companionPkg) {
    packages.push(companionPkg);
  }

  return {
    code: [
      'import { Hono } from "hono";',
      'import { KitHonoMiddleware } from "@wthek/hono-middleware";',
      "",
      "const app = new Hono();",
      "",
      "// Register @wthek centralized error handler on the Hono instance",
      "KitHonoMiddleware(app, { handleUnknownErrors: true, log: true });",
    ].join("\n"),
    packages,
  };
};

/**
 * Resolves packages and middleware code for Koa.
 */
const getKoaRecipe = (
  validator?: SupportedValidator
): { code: string; packages: string[] } => {
  const companionPkg = resolveCompanionPackage(validator);

  const packages = ["@wthek/koa-middleware", "http-error-kit"];
  if (companionPkg) {
    packages.push(companionPkg);
  }

  return {
    code: [
      'import Koa from "koa";',
      'import { KitKoaMiddleware } from "@wthek/koa-middleware";',
      "",
      "const app = new Koa();",
      "",
      "// Register middleware at top of pipeline (wraps downstream handlers)",
      "KitKoaMiddleware(app, { handleUnknownErrors: true, log: true });",
    ].join("\n"),
    packages,
  };
};

/**
 * Resolves packages and filter code for NestJS.
 */
const getNestJsRecipe = (
  validator?: SupportedValidator
): { code: string; packages: string[] } => {
  const companionPkg = resolveCompanionPackage(validator);

  const packages = ["@wthek/nestjs-middleware", "http-error-kit"];
  if (companionPkg) {
    packages.push(companionPkg);
  }

  return {
    code: [
      'import { NestFactory } from "@nestjs/core";',
      'import { KitNestJsMiddleware } from "@wthek/nestjs-middleware";',
      'import { AppModule } from "./app.module";',
      "",
      "async function bootstrap() {",
      "  const app = await NestFactory.create(AppModule);",
      "",
      "  // Register global @wthek middleware (auto-detects Express/Fastify adapter)",
      "  KitNestJsMiddleware(app, { handleUnknownErrors: true, log: true });",
      "",
      "  await app.listen(process.env.PORT ?? 3000);",
      "}",
      "bootstrap();",
    ].join("\n"),
    packages,
  };
};

/**
 * Resolves packages and middleware code for Restify.
 */
const getRestifyRecipe = (
  validator?: SupportedValidator
): { code: string; packages: string[] } => {
  const companionPkg = resolveCompanionPackage(validator);

  const packages = ["@wthek/restify-middleware", "http-error-kit"];
  if (companionPkg) {
    packages.push(companionPkg);
  }

  return {
    code: [
      'import restify from "restify";',
      'import { KitRestifyMiddleware } from "@wthek/restify-middleware";',
      "",
      "const server = restify.createServer();",
      "server.use(restify.plugins.bodyParser());",
      "",
      "// Register @wthek centralized error handler on the restifyError event",
      'server.on("restifyError", KitRestifyMiddleware({ handleUnknownErrors: true, log: true }));',
    ].join("\n"),
    packages,
  };
};

/**
 * Normalizes input framework name to a SupportedFramework.
 */
const normalizeFramework = (input: string): SupportedFramework => {
  const lower = input.trim().toLowerCase();
  if (lower === "fastify") return "fastify";
  if (lower === "hono") return "hono";
  if (lower === "koa") return "koa";
  if (lower === "nestjs" || lower === "nest") return "nestjs";
  if (lower === "restify") return "restify";
  return "express";
};

/**
 * Normalizes input validator name.
 */
const normalizeValidator = (input?: string): SupportedValidator | undefined => {
  if (!input) return undefined;
  const lower = input.trim().toLowerCase();
  if (lower === "zod") return "zod";
  if (lower === "typebox" || lower === "type-box") return "typebox";
  if (lower === "valibot") return "valibot";
  return undefined;
};

/**
 * Retrieves a verified, production-ready @wthek setup recipe for a specified framework and validator.
 * Eliminates agent hallucination by providing tested package names and copy-paste code.
 *
 * @param {string} framework - Web framework name (express, fastify, hono, koa, nestjs, restify).
 * @param {string} [validator] - Validation library (zod, valibot, typebox).
 * @returns {IFrameworkRecipeResult} Complete recipe with exact code and packages.
 *
 * @example
 * ```typescript
 * import { getFrameworkRecipe } from "@wthek/mcp";
 *
 * const recipe = getFrameworkRecipe("express", "zod");
 * console.log(recipe.packages);
 * ```
 */
export const getFrameworkRecipe = (
  framework: string,
  validator?: string
): IFrameworkRecipeResult => {
  const targetFramework = normalizeFramework(framework);
  const targetValidator = normalizeValidator(validator);

  let recipeData: { code: string; packages: string[] };

  switch (targetFramework) {
    case "fastify":
      recipeData = getFastifyRecipe(targetValidator);
      break;
    case "hono":
      recipeData = getHonoRecipe(targetValidator);
      break;
    case "koa":
      recipeData = getKoaRecipe(targetValidator);
      break;
    case "nestjs":
      recipeData = getNestJsRecipe(targetValidator);
      break;
    case "restify":
      recipeData = getRestifyRecipe(targetValidator);
      break;
    default:
      recipeData = getExpressRecipe(targetValidator);
      break;
  }

  const instructions = [
    `1. Install dependencies: npm install ${recipeData.packages.join(" ")}`,
    "2. Copy and adapt the recipe code into your application entrypoint.",
    "3. Throw named error classes (e.g. NotFoundError, BadRequestError) inside route handlers.",
  ];

  return {
    code: recipeData.code,
    description: `Production-ready @wthek error handling setup for ${targetFramework}${
      targetValidator ? ` with ${targetValidator}` : ""
    }.`,
    framework: targetFramework,
    instructions,
    packages: recipeData.packages,
    validator: targetValidator,
  };
};

