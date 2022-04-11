import { validateOptions } from "./validate-options.js";
import { fixtureImagesPath, fixturesDirPath, fixturesGlobPattern, outDirPath } from "./test-utils.js";
import { ValidatorResults } from "./global";
import path from "path";

test("returns validated options", async () => {
  const validOptions = {
    target: fixturesGlobPattern,
    outDir: outDirPath,
  };
  const expectedResult: ValidatorResults = {
    validatedOptions: {
      targetFilePaths: fixtureImagesPath,
      outDir: outDirPath,
    },
  };

  expect(await validateOptions(validOptions)).toEqual(expectedResult);
});

test("returns validate options error", async () => {
  const invalidOptions = {
    target: fixturesGlobPattern,
    outDir: outDirPath,
    unexpectedOption: "unexpectedOption",
  };
  const expectedResult: ValidatorResults = {
    error: expect.any(String),
  };

  expect(await validateOptions(invalidOptions)).toEqual(expectedResult);
});

test("returns `no matching files` error", async () => {
  const invalidOptions = {
    target: path.join(fixturesDirPath, "*.xxx"),
    outDir: outDirPath,
  };
  const expectedResult: ValidatorResults = {
    error: expect.any(String),
  };

  expect(await validateOptions(invalidOptions)).toEqual(expectedResult);
});
