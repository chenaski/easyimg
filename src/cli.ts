import { createCli } from "./create-cli.js";
import { createProcessor, processor } from "./processor.js";

(async () => {
  const processor = createProcessor({
    hooks: {
      onError: () => {
        process.exit(1);
      },
    },
  });
  const runCli = createCli({ processor });
  await runCli();
})();
