import { easyimg } from "./index.js";

(async () => {
  const options = { filePath: process.argv[2], outDir: process.argv[3] };
  await easyimg(options);
})();
