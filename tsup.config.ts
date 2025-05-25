import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    "core/index": "src/core/index.ts",
    "operations/index": "src/operations/index.ts",
  },
  format: ["cjs"],
  dts: true,
  clean: true,
  target: "es2020",
  outDir: "dist",
  sourcemap: true,
  external: ["mongoose"],
});
