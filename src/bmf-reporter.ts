import {
  Reporter,
  SerializedError,
  TestModule,
  TestRunEndReason
} from "vitest/node"
import { Calculations } from "./calculate.js"

// todo: allow saving to file
// todo: allow template syntax for saving names
// todo: allow configuring what measures to create
export class BMFReporter implements Reporter {
  async onTestRunEnd(
    testModules: ReadonlyArray<TestModule>,
    unhandledErrors: ReadonlyArray<SerializedError>,
    reason: TestRunEndReason
  ) {
    if (reason !== "passed" || unhandledErrors.length > 0) return

    const bmf: Record<string, Calculations> = {}

    for (const testModule of testModules) {
      for (const testCase of testModule.children.allTests("passed")) {
        const meta = testCase.meta()

        if (!meta.bench) {
          throw new Error("Expected test to report a benchmark")
        }

        const name = [testModule.project.name, testCase.fullName]
          .filter(Boolean)
          .join(" # ")

        if (name in bmf) {
          throw new Error(
            [
              `Expected "${name}" not to exist as a benchmark name.`,
              `Please remove duplicate test names.`,
              `If these tests are in two different projects, please add a project name in the vitest config to fix.`
            ].join("\n")
          )
        }

        bmf[name] = meta.bench.calculations
      }
    }

    console.log(JSON.stringify(bmf))
  }
}

export default BMFReporter
