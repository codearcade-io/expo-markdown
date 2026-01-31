import type { BuildConfig } from "bun";

const entrypoints = ["./src/index.ts"];

const defaultBuildConfig: BuildConfig = {
  entrypoints,
  outdir: "./dist",
  target: "browser",
  format: "esm",
  minify: true,
  external: [
    "react",
    "react-native",
    "expo-clipboard",
    "expo",
    "node:module",
    "markdown-it",
    "react-native-webview",
  ],
};

await Bun.build(defaultBuildConfig);
