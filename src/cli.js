import { createCli } from "./createCli.js";
import { easyimg } from "./index.js";

(async () => {
  const runCli = createCli({ processor: easyimg });
  await runCli();
})();
