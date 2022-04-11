import { InputOptions } from "./global";
import { processor } from "./processor.js";

export async function api(options: InputOptions) {
  return await processor(options as unknown as Record<string, unknown>);
}
