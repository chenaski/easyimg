import { createCli } from "./create-cli.js";
import { api } from "./api.js";

(async () => {
  const runCli = createCli({ processor: api });
  await runCli();
})();
