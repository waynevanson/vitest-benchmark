import { defineConfig } from "vitest/config"

// todo: move non-unit tests into integrated tests
export default defineConfig({
  test: {
    setupFiles: ["./vitest.setup.ts"],
    // exclude the fixtures in test files
    exclude: ["./test/*/**"]
  }
})
