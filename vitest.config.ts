import { defineConfig } from "vitest/config"

process.env["VITEST_RUNNER_BENCHMARK_OPTIONS"] = JSON.stringify({
  benchmark: {
    cycles: 64
  },
  warmup: {
    cycles: 10
  }
})

export default defineConfig({
  test: {
    runner: "./dist/runner.js",
    setupFiles: ["./vitest.setup.ts"]
  }
})
