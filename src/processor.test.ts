import path from "path";
import { jest } from "@jest/globals";

import { createProcessor, processor } from "./processor.js";
import {
  extByCodec,
  fixtureImagesPath,
  fixturesGlobPattern,
  getOutFilesMeta,
  originalFilesMeta,
  outDirPath,
  rmOutDir,
} from "./test-utils.js";

beforeEach(() => {
  return rmOutDir();
});

afterAll(() => {
  return rmOutDir();
});

test(`creates ${Object.values(extByCodec).join(", ")} compressed images for each original image`, async () => {
  const options = { target: fixturesGlobPattern, outDir: outDirPath };
  await processor(options);

  const outFilesMeta = await getOutFilesMeta();

  expect(Object.keys(outFilesMeta)).toHaveLength(fixtureImagesPath.length);

  for (const fixtureImagePath of fixtureImagesPath) {
    const { name, ext: originalFileExt } = path.parse(fixtureImagePath);
    const originalFileMeta = originalFilesMeta[name];
    const outFileMeta = outFilesMeta[name];

    let usedExt = Object.values(extByCodec);

    for (const outFile of outFileMeta) {
      usedExt = usedExt.filter((ext) => ext !== outFile.ext);

      if (originalFileMeta.ext !== ".png" && outFile.ext === ".png") {
        expect(outFile.size).toBeGreaterThan(originalFileMeta.size);
      } else {
        expect(outFile.size).toBeLessThan(originalFileMeta.size);
      }
    }

    expect(usedExt).toHaveLength(0);
  }
}, 20000);

describe("runs `onError` hook", () => {
  test("no files found", async () => {
    const onErrorHookMock = jest.fn();
    const processor = createProcessor({ hooks: { onError: onErrorHookMock } });

    await processor({ target: "error", outDir: outDirPath });

    expect(onErrorHookMock).toHaveBeenCalledTimes(1);
  });

  test("options scheme is invalid", async () => {
    const onErrorHookMock = jest.fn();
    const processor = createProcessor({ hooks: { onError: onErrorHookMock } });

    await processor({ target: fixturesGlobPattern, outDir: outDirPath, scheme: "invalid" });

    expect(onErrorHookMock).toHaveBeenCalledTimes(1);
  });
});
