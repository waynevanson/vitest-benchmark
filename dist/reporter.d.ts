import { TestArtifact } from "vitest";
import type { Reporter } from "vitest/reporters";
export type BMF = Record<string, Record<string, {
    value: number;
    lower_value?: number;
    higher_value?: number;
}>>;
type TestCase = Parameters<NonNullable<Reporter["onTestCaseAnnotate"]>>[0];
type Vitest = Parameters<NonNullable<Reporter["onInit"]>>[0];
export declare class BenchmarkReporterBMF implements Reporter {
    #private;
    onInit(vitest: Vitest): void;
    benchmarks: Map<string, Record<string, {
        value: number;
        lower_value?: number;
        higher_value?: number;
    }>>;
    onTestCaseArtifactRecord(testCase: TestCase, artefact: TestArtifact): void;
    onTestRunEnd(): void;
}
export default BenchmarkReporterBMF;
