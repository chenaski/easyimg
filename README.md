# easyimg

Makes work with images easier.

## Usage

### CLI

```bash
npx @easyimg/cli [options] <glob>
npx @easyimg/cli --out-dir "out" "fixtures/*.jpg"
```

### API

```js
import easyimg from "@easyimg/api";

const options = { filePaths: "fixtures/*.jpg", outDir: "out" };
await easyimg(options);
```

## Options

| API         | CLI                                                     | Description                  |
| ----------- | ------------------------------------------------------- | ---------------------------- |
| `filePaths` | Doesn't have key, can be passed after or before options | Glob pattern to source files |
| `outDir`    | `--out-dir`                                             | Path to output directory     |
