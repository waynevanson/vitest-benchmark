import { TestAttachment, TestArtifactBase } from "vitest"

export interface BenchmarkAttachment extends TestAttachment {
  contentType: "application/json"
  body: string
}

export interface BenchmarkArtefact extends TestArtifactBase {
  type: "benchmark:samples"
  attachments: [BenchmarkAttachment]
}

export const ARTEFACT_BENCHMARK = Symbol("ARTEFACT_BENCHMARK")

declare module "vitest" {
  interface TestArtifactRegistry {
    [ARTEFACT_BENCHMARK]: BenchmarkArtefact
  }
}

// Send length of cycles to a reporter
export function createBenchmarkAttachment(
  id: string,
  cycles: number
): BenchmarkAttachment {
  const samples = Array.from({ length: cycles }, (_, index) => {
    const counter = index + 1
    const open = `${id}:open:${counter}`
    const shut = `${id}:shut:${counter}`
    const measure = performance.measure(open, shut)
    return measure.duration
  })

  const body = JSON.stringify(samples)

  return { contentType: "application/json", body }
}
