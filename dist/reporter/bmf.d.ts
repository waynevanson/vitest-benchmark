import { Reporter, SerializedError, TestModule, TestRunEndReason, Vitest } from "vitest/node";
export interface Measure {
    value: number;
    lower_value?: number;
    upper_value?: number;
}
export interface Measures {
    [measure: string]: Measure;
}
export interface BenchmarkMetricFormat {
    [benchmark: string]: Measures;
}
export interface BMFReporterConfig {
    outputFile: undefined | string;
}
export default class BMFReporter implements Reporter {
    config: BMFReporterConfig;
    vitest: Vitest | undefined;
    onInit(vitest: Vitest): void;
    onTestRunEnd(testModules: ReadonlyArray<TestModule>, unhandledErrors: ReadonlyArray<SerializedError>, reason: TestRunEndReason): void;
}
