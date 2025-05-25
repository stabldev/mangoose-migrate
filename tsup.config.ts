import { defineConfig, Options } from "tsup";

const baseConfig: Options = {
  format: ["cjs"],
  target: "es2020",
  outDir: "dist",
  external: ["mongoose"],
  clean: true,
};

export default defineConfig([
  {
    ...baseConfig,
    entry: ["src/cli.ts"],
    dts: false,
    sourcemap: false,
  },
  {
    ...baseConfig,
    entry: {
      "core/index": "src/core/index.ts",
      "operations/index": "src/operations/index.ts",
    },
    dts: true,
    sourcemap: true,
  },
]);
