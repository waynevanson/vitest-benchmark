import { TestAttachment, TestArtifactBase } from "vitest";
export interface BenchmarkAttachment extends TestAttachment {
    contentType: "application/json";
    body: string;
}
export interface BenchmarkArtefact extends TestArtifactBase {
    type: "benchmark:samples";
    attachments: [BenchmarkAttachment];
}
export declare const ARTEFACT_BENCHMARK: unique symbol;
declare module "vitest" {
    interface TestArtifactRegistry {
        [ARTEFACT_BENCHMARK]: BenchmarkArtefact;
    }
}
export declare function createBenchmarkAttachment(id: string, cycles: number): BenchmarkAttachment;
