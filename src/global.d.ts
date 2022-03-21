import { Options } from "./index.js";

export interface Options {
  filePaths: string[];
  outDir: string;
}

export type Processor = (options: Options) => void;
