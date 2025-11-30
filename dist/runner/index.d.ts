import { type Suite, type SuiteHooks, type Test } from "@vitest/runner";
import { type SerializedConfig } from "vitest";
import { VitestTestRunner } from "vitest/runners";
import type { VitestRunner } from "vitest/suite";
import { BenchRunnerMeta, VitestBenchRunnerUserConfig } from "./config.js";
declare module "vitest" {
    interface ProvidedContext {
        benchrunner?: VitestBenchRunnerUserConfig;
    }
}
declare module "@vitest/runner" {
    interface TaskMeta {
        benchrunner?: BenchRunnerMeta;
    }
}
/**
 * @summary
 * A `VitestRunner` that runs tests as benchmarks.
 */
export default class VitestBenchRunner extends VitestTestRunner implements VitestRunner {
    #private;
    constructor(config: SerializedConfig);
    onBeforeRunSuite(suite: Suite): Promise<void>;
    runTask(test: Test): Promise<void>;
    getHooks(suite: Suite): Pick<SuiteHooks<object>, "afterEach" | "beforeEach">;
}
