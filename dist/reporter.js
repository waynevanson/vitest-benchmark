import { writeFileSync } from "node:fs";
export class BenchmarkReporterBMF {
    #outputFile;
    onInit(vitest) {
        this.#outputFile =
            typeof vitest.config.outputFile === "string"
                ? vitest.config.outputFile
                : undefined;
    }
    benchmarks = new Map();
    onTestCaseArtifactRecord(testCase, artefact) {
        if (artefact.type !== "benchmark:samples")
            return;
        const name = [testCase.module.relativeModuleId, testCase.fullName].join(" > ");
        const attachment = artefact.attachments?.[0];
        const durations = JSON.parse(attachment.body?.toString() ?? "[]");
        const latencyAverage = durations.reduce((accu, curr) => accu + curr, 0) / durations.length;
        const latencyMin = durations.reduce((accu, curr) => Math.min(accu, curr));
        const latencyMax = durations.reduce((accu, curr) => Math.max(accu, curr));
        const measures = {
            latency: {
                value: latencyAverage,
                lower_value: latencyMin,
                higher_value: latencyMax
            }
        };
        this.benchmarks.set(name, measures);
    }
    onTestRunEnd() {
        const bmf = Object.fromEntries(this.benchmarks.entries());
        if (this.#outputFile) {
            writeFileSync(this.#outputFile, JSON.stringify(bmf, null, 4));
        }
        else {
            console.log(bmf);
        }
    }
}
export default BenchmarkReporterBMF;
