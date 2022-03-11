import { easyimg } from "./index.js";
import { program } from "commander";

(async () => {
  program.option("-o, --out-dir <path>", "Output directory");

  program.parse();

  const options = program.opts();

  await easyimg(program.rawArgs[program.rawArgs.length - 1], options);
})();
