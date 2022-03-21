import { createCli } from "./create-cli.js";
import { easyimg } from "./index.js";

(async () => {
  const runCli = createCli({ processor: easyimg });
  await runCli();
})();
