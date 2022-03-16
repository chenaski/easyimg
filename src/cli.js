import { easyimg } from "./index.js";
import { program } from "commander";
import Joi from "joi";
import glob from "tiny-glob";
import { logError } from "./logError.js";

(async () => {
  program.option("-o, --out-dir <path>", "Output directory");
  program.parse();

  const options = program.opts();
  const globPattern = program.rawArgs[program.rawArgs.length - 1];

  const schema = Joi.object({
    globPattern: Joi.string().required(),
    outDir: Joi.string().required(),
  });
  const validationResult = schema.validate({ globPattern, ...options });

  if (validationResult.error) {
    logError(validationResult.error);
    process.exit(1);
  }

  const filePaths = await glob(validationResult.value.globPattern);

  if (!filePaths.length) {
    logError(
      `No files matching the pattern "${globPattern}" were found.\nPlease check for typing mistakes in the pattern.`
    );
    process.exit(1);
  }

  await easyimg({ filePaths, ...validationResult.value });
})();
