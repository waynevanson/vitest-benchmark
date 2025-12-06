import { defineConfig } from "vitest/config"

const BENCHMARK = process.env.BENCHMARK === "1"
const CI = process.env.CI

const runner = BENCHMARK ? "./src/runner/index.ts" : undefined

const benchrunner = CI
  ? {
      warmup: {
        minMs: 2_000
      },
      benchmark: {
        minMs: 60_000
      }
    }
  : {
      warmup: {
        minMs: 50
      },
      benchmark: {
        minMs: 3_000
      }
    }

export default defineConfig({
  test: {
    setupFiles: ["./vitest.setup.ts"],
    // exclude the fixtures in test files
    exclude: ["./test/*/**", "node_modules/"],
    reporters: ["default"],
    runner,
    provide: {
      benchrunner: {
        ...benchrunner,
        results: {
          latency: {
            average: true,
            max: true,
            min: true,
            percentiles: [0.999, 0.99, 0.9, 0.75, 0.5, 0.01]
          }
        }
      }
    }
  }
})
