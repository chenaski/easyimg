import { Command } from "commander";
import Joi from "joi";
import glob from "tiny-glob";

import { logError } from "./log-error.js";
import { Options, Processor } from "./global.js";

export function createCli({ processor }: { processor: Processor }) {
  return async function cli({ cliOptions }: { cliOptions?: string[] } = {}): Promise<void> {
    const program = new Command();

    program.option("-o, --out-dir <path>", "Output directory");
    program.parse(cliOptions || process.argv);

    const options = program.opts();
    const globPattern = program.args[0];

    const schema = Joi.object({
      globPattern: Joi.string().required(),
      outDir: Joi.string().required(),
    });
    const validationResult = schema.validate({ globPattern, ...options });

    if (validationResult.error) {
      logError(validationResult.error.message);
      process.exit(1);
      return;
    }

    const filePaths: string[] = await glob(validationResult.value.globPattern);

    if (!filePaths.length) {
      logError(
        `No files matching the pattern "${globPattern}" were found.\nPlease check for typing mistakes in the pattern.`
      );
      process.exit(1);
      return;
    }

    await processor({ filePaths, ...validationResult.value });
  };
}
