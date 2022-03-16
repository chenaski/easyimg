import { jest } from "@jest/globals";
import path from "path";
import { createCli } from "./createCli.js";

import { fixtureImagesPath, fixturesDirPath } from "./testUtils.js";

const processorMock = jest.fn();
const runCli = createCli({ processor: processorMock });

beforeEach(() => {
  jest.resetAllMocks();
});

test("doesn't runs API if no files were found", async () => {
  const globPattern = path.join(fixturesDirPath, "*.png");
  const outDir = "output-directory";
  const options = `--out-dir ${outDir} ${globPattern}`;

  const mockExit = jest.spyOn(process, "exit").mockImplementation(() => {});

  const result = await runCli({ cliOptions: `node ./cli.js ${options}`.split(" ") });

  expect(mockExit).toHaveBeenCalledWith(1);
  expect(processorMock).toBeCalledTimes(0);
}, 20000);
