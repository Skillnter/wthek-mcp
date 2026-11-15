/**
 * Supported web frameworks for @wthek recipes.
 */
export type SupportedFramework =
  | "express"
  | "fastify"
  | "hono"
  | "koa"
  | "nestjs"
  | "restify";

/**
 * Supported schema validation libraries for @wthek companion transformers.
 */
export type SupportedValidator = "typebox" | "valibot" | "zod";

/**
 * Result structure returned when requesting a framework recipe.
 * @interface
 */
export interface IFrameworkRecipeResult {
  code: string;
  description: string;
  framework: SupportedFramework;
  instructions: string[];
  packages: string[];
  validator?: SupportedValidator;
}

