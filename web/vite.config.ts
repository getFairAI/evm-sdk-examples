import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";
 
// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			process: "process/browser",
			path: "path-browserify",
			os: "os-browserify",
      stream: "stream-browserify",
		},
	},
	plugins: [
		react(),
		nodePolyfills({
			// To exclude specific polyfills, add them to this list.
			exclude: [
				"fs", // Excludes the polyfill for `fs` and `node:fs`.
			],
			// Whether to polyfill specific globals.
			globals: {
				Buffer: true,
				global: true,
				process: true,
			},
			// Whether to polyfill `node:` protocol imports.
			protocolImports: true,
		}),
	],
});