import { defineConfig } from "tsup";
import nodePolyfills from "rollup-plugin-polyfill-node";

export default defineConfig({
  shims: true,
  plugins: [nodePolyfills({ include: null })],
});
