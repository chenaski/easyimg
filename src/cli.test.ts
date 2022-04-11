import { jest } from "@jest/globals";

import { createCli } from "./create-cli.js";
import { fixtureImagesPath, fixturesDirPath, fixturesGlobPattern } from "./test-utils.js";

const processorMock = jest.fn();
const runCli = createCli({ processor: processorMock });

beforeEach(() => {
  jest.resetAllMocks();
});

test("runs API with passed options", async () => {
  const outDir = "output-directory";
  const options = `--out-dir ${outDir} ${fixturesGlobPattern}`;
  const expectedOptions = {
    target: fixturesGlobPattern,
    outDir,
  };

  const result = await runCli({ cliOptions: `node ./cli.js ${options}`.split(" ") });

  expect(processorMock).toBeCalledTimes(1);
  expect(processorMock).toBeCalledWith(expectedOptions);
}, 20000);
