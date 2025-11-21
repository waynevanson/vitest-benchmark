import { writeFileSync } from "node:fs"
import { TestAnnotation, TestArtifact } from "vitest"
import type { Reporter } from "vitest/reporters"

// Format details
// https://bencher.dev/docs/reference/bencher-metric-format/
export type BMF = Record<
  string,
  Record<string, { value: number; lower_value?: number; higher_value?: number }>
>

type TestCase = Parameters<NonNullable<Reporter["onTestCaseAnnotate"]>>[0]
type Vitest = Parameters<NonNullable<Reporter["onInit"]>>[0]

export class BenchmarkReporterBMF implements Reporter {
  #outputFile: undefined | string

  onInit(vitest: Vitest) {
    this.#outputFile =
      typeof vitest.config.outputFile === "string"
        ? vitest.config.outputFile
        : undefined
  }

  benchmarks = new Map<string, BMF[string]>()

  onTestCaseArtifactRecord(testCase: TestCase, artefact: TestArtifact) {
    if (artefact.type !== "benchmark:samples") return

    const name = [testCase.module.relativeModuleId, testCase.fullName].join(
      " > "
    )

    const attachment = artefact.attachments?.[0]!
    const durations: Array<number> = JSON.parse(
      attachment.body?.toString() ?? "[]"
    )

    const latencyAverage =
      durations.reduce((accu, curr) => accu + curr, 0) / durations.length

    const latencyMin = durations.reduce((accu, curr) => Math.min(accu, curr))

    const latencyMax = durations.reduce((accu, curr) => Math.max(accu, curr))

    const measures = {
      latency: {
        value: latencyAverage,
        lower_value: latencyMin,
        higher_value: latencyMax
      }
    }

    this.benchmarks.set(name, measures)
  }

  onTestRunEnd() {
    const bmf = Object.fromEntries(this.benchmarks.entries())

    if (this.#outputFile) {
      writeFileSync(this.#outputFile, JSON.stringify(bmf, null, 4))
    } else {
      console.log(bmf)
    }
  }
}

export default BenchmarkReporterBMF
