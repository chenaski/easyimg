import { easyimg } from "./index.js";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDirPath = path.resolve(__dirname, "../out");
const fixturesDirPath = path.resolve(__dirname, "../fixtures");
const originalImagePath = path.resolve(fixturesDirPath, "test.jpg");

const rmOutDir = async () => {
  await fs.rm(outDirPath, { force: true, recursive: true });
};
const getOriginalFileSize = async () => {
  const { size } = await fs.lstat(originalImagePath);
  return size;
};
const getOutDirFilesMeta = async () => {
  const filePaths = await fs.readdir(outDirPath);
  return Promise.all(
    filePaths.map(async (fileName) => {
      const filePath = path.resolve(outDirPath, fileName);
      const { size } = await fs.lstat(filePath);

      return {
        filePath,
        size,
      };
    })
  );
};

beforeEach(() => {
  return rmOutDir();
});

test("creates 5 images", async () => {
  const options = { filePath: originalImagePath, outDir: outDirPath };
  await easyimg(options);

  const filesMeta = await getOutDirFilesMeta();

  expect(filesMeta).toHaveLength(5);

  for (const fileMeta of filesMeta) {
    const ext = path.extname(fileMeta.filePath);

    if (ext !== ".png") {
      expect(fileMeta.size).toBeLessThan(await getOriginalFileSize());
    } else {
      expect(fileMeta.size).toBeGreaterThan(await getOriginalFileSize());
    }
  }
}, 20000);
