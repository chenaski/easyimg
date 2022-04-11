export interface InputOptions {
  target: string;
  outDir: string;
}

export interface ValidatedOptions {
  targetFilePaths: string[];
  outDir: string;
}

export interface ValidatorResults {
  error?: string;
  validatedOptions?: ValidatedOptions;
}

export type Processor = (options: Record<string, unknown>) => void;
