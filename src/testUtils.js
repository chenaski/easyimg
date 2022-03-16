import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

export const currentDirPath = path.dirname(fileURLToPath(import.meta.url));
export const outDirPath = path.resolve(currentDirPath, "../out");
export const fixturesDirPath = path.resolve(currentDirPath, "../fixtures");
export const fixtureImagesPath = (await fs.readdir(fixturesDirPath)).map((fileName) =>
  path.join(fixturesDirPath, fileName)
);
export const extByCodec = {
  oxipng: ".png",
  mozjpeg: ".jpg",
  webp: ".webp",
  avif: ".avif",
  jxl: ".jxl",
};

export const rmOutDir = async () => {
  await fs.rm(outDirPath, { force: true, recursive: true });
};

export const originalFilesMeta = (
  await Promise.all(
    fixtureImagesPath.map(async (filePath) => {
      const { name: id, ext } = path.parse(filePath);
      const { size } = await fs.lstat(filePath);
      return [id, ext, size];
    })
  )
).reduce((result, [id, ext, size]) => ({ ...result, [id]: { ext, size } }), {});

export const getOutFilesMeta = async () => {
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
