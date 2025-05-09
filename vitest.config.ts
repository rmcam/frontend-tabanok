import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      reporter: ["text", "json", "html"],
    },
    environmentOptions: {
      jsdom: {
        resources: 'usable',
        runScripts: 'dangerously',
        // Vitest does not have a direct tsconfig option under test.environmentOptions.
        // The tsconfig is usually inferred or configured via the build tool (Vite).
        // Removing the invalid tsconfig option here.
      },
    },
  },
});
