import glob from "tiny-glob";
import Joi from "joi";

import { ValidatedOptions, ValidatorResults } from "./global";

export async function validateOptions(options: Record<string, unknown>): Promise<ValidatorResults> {
  const schema = Joi.object({
    target: Joi.string().required(),
    outDir: Joi.string().required(),
  });
  const validationResult = schema.validate(options);

  if (validationResult.error) {
    return {
      error: validationResult.error.message,
    };
  }

  const filePaths: string[] = await glob(validationResult.value.target, { absolute: true });

  if (!filePaths.length) {
    const errorMessage = `No files matching the pattern "${options.target}" were found.\nPlease check for typing mistakes in the pattern.`;

    return {
      error: errorMessage,
    };
  }

  return {
    validatedOptions: {
      targetFilePaths: filePaths,
      outDir: validationResult.value.outDir,
    },
  };
}
