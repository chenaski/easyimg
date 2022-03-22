import { Options } from "./api.js";

export interface Options {
  filePaths: string[];
  outDir: string;
}

export type Processor = (options: Options) => void;
