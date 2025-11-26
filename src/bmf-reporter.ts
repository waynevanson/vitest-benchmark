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

        bmf[name] = meta.bench.calculations
      }
    }

    console.log(JSON.stringify(bmf))
  }
}

export default BMFReporter
