import { easyimg } from "./index.js";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDirPath = path.resolve(__dirname, "../out");
const fixturesDirPath = path.resolve(__dirname, "../fixtures");
const fixtureImagesPath = (await fs.readdir(fixturesDirPath)).map((fileName) => path.join(fixturesDirPath, fileName));
const extByCodec = {
  oxipng: ".png",
  mozjpeg: ".jpg",
  webp: ".webp",
  avif: ".avif",
  jxl: ".jxl",
};

const rmOutDir = async () => {
  await fs.rm(outDirPath, { force: true, recursive: true });
};

const originalFilesMeta = (
  await Promise.all(
    fixtureImagesPath.map(async (filePath) => {
      const { name: id, ext } = path.parse(filePath);
      const { size } = await fs.lstat(filePath);
      return [id, ext, size];
    })
  )
).reduce((result, [id, ext, size]) => ({ ...result, [id]: { ext, size } }), {});

const getOutFilesMeta = async () => {
  const outFilesPath = await fs.readdir(outDirPath);

  const result = {};

  for (const fileName of outFilesPath) {
    const { name: id, ext } = path.parse(fileName);
    const { size } = await fs.lstat(path.join(outDirPath, fileName));

    if (!result[id]) result[id] = [];

    result[id].push({ ext, size });
  }

  return result;
};

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
