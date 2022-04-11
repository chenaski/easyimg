import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

export const currentDirPath = path.dirname(fileURLToPath(import.meta.url));
export const outDirPath = path.resolve(currentDirPath, "../out");
export const fixturesDirPath = path.resolve(currentDirPath, "../fixtures");
export const fixturesGlobPattern = path.join(fixturesDirPath, "*.jpg");
export const fixtureImagesPath = (await fs.readdir(fixturesDirPath)).map((fileName) =>
  path.join(fixturesDirPath, fileName)
);
export enum Codecs {
  oxipng = "oxipng",
  mozjpeg = "mozjpeg",
  webp = "webp",
  avif = "avif",
  jxl = "jxl",
}
export const extByCodec = {
  [Codecs.oxipng]: ".png",
  [Codecs.mozjpeg]: ".jpg",
  [Codecs.webp]: ".webp",
  [Codecs.avif]: ".avif",
  [Codecs.jxl]: ".jxl",
};

export interface FileMeta {
  ext: string;
  size: number;
}

export const rmOutDir = async (): Promise<void> => {
  await fs.rm(outDirPath, { force: true, recursive: true });
};

export type OriginalFilesMeta = Record<string, FileMeta>;
export const originalFilesMeta: OriginalFilesMeta = (
  await Promise.all(
    fixtureImagesPath.map(async (filePath) => {
      const { name: id, ext } = path.parse(filePath);
      const { size } = await fs.lstat(filePath);
      return [id, ext, size];
    })
  )
).reduce((result, [id, ext, size]) => ({ ...result, [id]: { ext, size } }), {});

export type OutFilesMeta = Record<string, FileMeta[]>;
export const getOutFilesMeta = async (): Promise<OutFilesMeta> => {
  const outFilesPath = await fs.readdir(outDirPath);

  const result: OutFilesMeta = {} as OutFilesMeta;

  for (const fileName of outFilesPath) {
    const { name: id, ext } = path.parse(fileName);
    const { size } = await fs.lstat(path.join(outDirPath, fileName));

    if (!result[id]) result[id] = [];

    result[id].push({ ext, size });
  }

  return result;
};
