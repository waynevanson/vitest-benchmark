import { startVitest } from "vitest/node"

export async function runVitest(fixture: string, suite: string) {
  return await startVitest("test", [`${suite}.spec.ts`], undefined, {
    test: {
      watch: false,
      runner: "@waynevanson/vitest-benchmark/runner",
      setupFiles: [`./${suite}.setup.ts`],
      maxWorkers: 1,
      root: fixture,
      reporters: ["@waynevanson/vitest-benchmark/reporter/silent"]
    }
  })
}
