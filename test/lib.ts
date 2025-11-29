import * as fs from "node:fs"
import path from "node:path"
import { startVitest } from "vitest/node"

export async function runVitest(fixture: string, suite: string) {
  const setupFile = `./${suite}.setup.ts`

  return await startVitest(
    "test",
    [`${suite}.spec.ts`],
    {
      watch: false,
      setupFiles: fs.existsSync(path.join(fixture, setupFile))
        ? [setupFile]
        : undefined,
      maxWorkers: 1,
      root: fixture,
      reporters: ["@waynevanson/vitest-benchmark/reporter/silent"]
    },
    {
      test: {
        runner: "@waynevanson/vitest-benchmark/runner"
      }
    }
  )
}
