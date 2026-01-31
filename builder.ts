import type { BuildConfig } from "bun";

const entrypoints = ["./src/index.ts"];

const defaultBuildConfig: BuildConfig = {
  entrypoints,
  outdir: "./dist",
  target: "browser",
  minify: true,
  sourcemap: "external",
  format: "esm",
  external: ["react", "react-native", "expo-clipboard", "expo"],
};

await Bun.build(defaultBuildConfig);
