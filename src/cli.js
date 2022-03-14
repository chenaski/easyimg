import { easyimg } from "./index.js";
import { program } from "commander";
import Joi from "joi";
import { logError } from "./logError.js";

(async () => {
  program.option("-o, --out-dir <path>", "Output directory");
  program.parse();

  const options = program.opts();
  const filePath = program.rawArgs[program.rawArgs.length - 1];

  const schema = Joi.object({
    filePath: Joi.string().required(),
    outDir: Joi.string().required(),
  });
  const validationResult = schema.validate({ filePath, ...options });

  if (validationResult.error) {
    logError(validationResult.error);
    process.exit(1);
  }

  await easyimg(validationResult.value);
})();
