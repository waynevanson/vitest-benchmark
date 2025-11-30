import { BenchRunnerMeta, VitestBenchRunnerConfig } from "./config";
type Optional<T> = {
    enabled: false;
} | {
    enabled: true;
    with: T;
};
export type ResultsConfig = {
    samples: Optional<{
        latency: {
            measures: Optional<{
                average: Optional<{
                    throughput: {
                        average: boolean;
                    };
                }>;
                min: Optional<{
                    throughput: {
                        max: boolean;
                    };
                }>;
                max: Optional<{
                    throughput: {
                        min: boolean;
                    };
                }>;
            }>;
            percentiles: Array<number>;
        };
        throughput: {
            percentiles: Array<number>;
        };
    }>;
};
export declare function deriveResultsConfig(config: VitestBenchRunnerConfig["results"]): ResultsConfig;
export declare function deriveMeta(samples: Array<number>, cycles: number, config: ResultsConfig): BenchRunnerMeta;
export {};
