import { ImagePool } from "@squoosh/lib";
import { cpus } from "os";
import fs from "fs/promises";
import path from "path";

export async function easyimg(options) {
  const imagePool = new ImagePool(cpus().length);

  await fs.mkdir(options.outDir, { recursive: true });

  for (const filePath of options.filePaths) {
    const file = await fs.readFile(filePath);
    const { name: srcFileName } = path.parse(filePath);
    const image = imagePool.ingestImage(file);

    const encodeOptions = {
      oxipng: {},
      mozjpeg: {},
      webp: {},
      avif: {},
      jxl: {},
    };
    const encodedImage = await image.encode(encodeOptions);

    for (const encodedImage of Object.values(image.encodedWith)) {
      const resultImage = await encodedImage;
      await fs.writeFile(`${path.resolve(options.outDir, srcFileName)}.${resultImage.extension}`, resultImage.binary);
    }
  }

  await imagePool.close();
}
