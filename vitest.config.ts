import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    runner: "./dist/runner.js",
    reporters: "./dist/reporter.js"
  }
})
