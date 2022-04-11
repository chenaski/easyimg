import { cpus } from "os";
import fs from "fs/promises";
import path from "path";
// @ts-ignore wait for https://github.com/GoogleChromeLabs/squoosh/issues/1211
import { ImagePool } from "@squoosh/lib";

import { Codecs } from "./test-utils.js";
import { validateOptions } from "./validate-options.js";
import { logError } from "./log-error.js";

type ProcessorOptions = Record<string, unknown>;
interface ProcessorHooks {
  onError: () => void;
}

export function createProcessor({ hooks }: { hooks?: ProcessorHooks } = {}) {
  return (options: ProcessorOptions) => processor(options, hooks);
}

export async function processor(options: Record<string, unknown>, hooks?: ProcessorHooks): Promise<void> {
  const validatorResult = await validateOptions(options);

  if (validatorResult?.error) {
    logError(validatorResult.error);
    hooks?.onError?.();
    return;
  }

  if (!validatorResult.validatedOptions) {
    logError("No options provided");
    hooks?.onError?.();
    return;
  }

  const { validatedOptions } = validatorResult;

  const imagePool = new ImagePool(cpus().length);

  await fs.mkdir(validatedOptions.outDir, { recursive: true });

  for (const filePath of validatedOptions.targetFilePaths) {
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
      await fs.writeFile(
        `${path.resolve(validatedOptions.outDir, srcFileName)}.${resultImage.extension}`,
        resultImage.binary
      );
    }
  }

  await imagePool.close();
}
