import { VitestBenchRunnerConfig, BenchRunnerMeta } from "./config.js";
export declare function calculate(config: VitestBenchRunnerConfig["results"], context: {
    durations: Array<number>;
    cycles: number;
}): BenchRunnerMeta | undefined;
export declare function calculatePercentile(samples: Array<number>, percentile: number): number;
export declare function calculatePercentiles(samples: Array<number>, percentiles: Array<number>): Record<string, number>;
