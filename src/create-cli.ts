import { Command } from "commander";

import { InputOptions, Processor } from "./global.js";

export function createCli({ processor }: { processor: Processor }) {
  return async function cli({ cliOptions }: { cliOptions?: string[] } = {}): Promise<void> {
    const program = new Command();

    program.option("-o, --out-dir <path>", "Output directory");
    program.parse(cliOptions || process.argv);

    const options = program.opts();
    const target = program.args[0];

    await processor({ target, ...options });
  };
}
