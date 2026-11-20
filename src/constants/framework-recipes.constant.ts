import type { SupportedValidator } from "../interfaces/framework-recipe.interface";

/**
 * Companion validation transformer package names mapped by validation library.
 * @constant
 *
 * @example
 * ```typescript
 * import { COMPANION_TRANSFORMERS } from "@wthek/mcp";
 *
 * const zodPackage = COMPANION_TRANSFORMERS["zod"];
 * // "@wthek/zod-transformer"
 * ```
 */
export const COMPANION_TRANSFORMERS: Record<SupportedValidator, string> = {
  typebox: "@wthek/typebox-transformer",
  valibot: "@wthek/valibot-transformer",
  zod: "@wthek/zod-transformer",
};

