import { VitestBenchRunnerConfig, BenchRunnerMeta } from "./config.js";
export declare function calculate(config: VitestBenchRunnerConfig["results"], context: {
    samples: Array<number>;
    cycles: number;
}): BenchRunnerMeta | undefined;
export declare function calculatePercentile(samples: Array<number>, percentile: number): number;
