import { cpus } from "os";
import fs from "fs/promises";
import path from "path";
// @ts-ignore wait for https://github.com/GoogleChromeLabs/squoosh/issues/1211
import { ImagePool } from "@squoosh/lib";

import { Codecs } from "./test-utils";
import { Options } from "./global.js";

export async function easyimg(options: Options): Promise<void> {
  const imagePool = new ImagePool(cpus().length);

  await fs.mkdir(options.outDir, { recursive: true });

  for (const filePath of options.filePaths) {
    const file = await fs.readFile(filePath);
    const { name: srcFileName } = path.parse(filePath);
    const image = imagePool.ingestImage(file);

    const encodeOptions: Record<Codecs, any> = {
      oxipng: {},
      mozjpeg: {},
      webp: {},
      avif: {},
      jxl: {},
    };
    const encodedImage = await image.encode(encodeOptions);

    for (const encodedImage of Object.values(image.encodedWith)) {
      const resultImage = (await encodedImage) as { extension: string; binary: NodeJS.ArrayBufferView };
      await fs.writeFile(`${path.resolve(options.outDir, srcFileName)}.${resultImage.extension}`, resultImage.binary);
    }
  }

  await imagePool.close();
}
