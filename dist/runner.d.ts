import { type Suite, type SuiteHooks, type Test } from "@vitest/runner";
import type { SerializedConfig, TestArtifactBase, TestAttachment } from "vitest";
import { VitestTestRunner } from "vitest/runners";
import type { VitestRunner } from "vitest/suite";
/**
 * @summary
 * A `VitestRunner` that runs tests as benchmarks.
 */
export declare class VitestBenchRunner extends VitestTestRunner implements VitestRunner {
    #private;
    constructor(config: SerializedConfig);
    onBeforeRunSuite(suite: Suite): Promise<void>;
    runTask(test: Test): Promise<void>;
    getHooks(suite: Suite): Pick<SuiteHooks<object>, "beforeEach" | "afterEach">;
    createBenchmarkAttachment(id: string): BenchmarkAttachment;
}
export interface BenchmarkAttachment extends TestAttachment {
    contentType: "application/json";
    body: string;
}
export interface BenchmarkArtefact extends TestArtifactBase {
    type: "benchmark:samples";
    attachments: [BenchmarkAttachment];
}
declare const ARTEFACT_BENCHMARK: unique symbol;
declare module "vitest" {
    interface TestArtifactRegistry {
        [ARTEFACT_BENCHMARK]: BenchmarkArtefact;
    }
}
export default VitestBenchRunner;
