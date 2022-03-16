import path from "path";
import { easyimg } from "./index.js";
import {
  extByCodec,
  fixtureImagesPath,
  getOutFilesMeta,
  originalFilesMeta,
  outDirPath,
  rmOutDir,
} from "./testUtils.js";

beforeEach(() => {
  return rmOutDir();
});

afterAll(() => {
  return rmOutDir();
});

test(`creates ${Object.values(extByCodec).join(", ")} compressed images for each original image`, async () => {
  const options = { filePaths: fixtureImagesPath, outDir: outDirPath };
  await easyimg(options);

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
