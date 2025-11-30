import * as v from "valibot";
export declare const schema: v.OptionalSchema<v.ObjectSchema<{
    readonly benchmark: v.ExactOptionalSchema<v.ObjectSchema<{
        readonly minCycles: v.SchemaWithPipe<readonly [v.ExactOptionalSchema<v.NumberSchema<undefined>, 1>, v.MinValueAction<number, 1, undefined>]>;
        readonly minMs: v.SchemaWithPipe<readonly [v.ExactOptionalSchema<v.NumberSchema<undefined>, 0>, v.MinValueAction<number, 0, undefined>]>;
    }, undefined>, {
        minCycles: 1;
        minMs: 0;
    }>;
    readonly warmup: v.ExactOptionalSchema<v.ObjectSchema<{
        readonly minCycles: v.SchemaWithPipe<readonly [v.ExactOptionalSchema<v.NumberSchema<undefined>, 0>, v.MinValueAction<number, 0, undefined>]>;
        readonly minMs: v.SchemaWithPipe<readonly [v.ExactOptionalSchema<v.NumberSchema<undefined>, 0>, v.MinValueAction<number, 0, undefined>]>;
    }, undefined>, {
        minCycles: 0;
        minMs: 0;
    }>;
}, undefined>, {
    benchmark: {
        minCycles: 1;
        minMs: 0;
    };
    warmup: {
        minCycles: 0;
        minMs: 0;
    };
}>;
export interface VitestBenchRunnerUserConfig {
    benchmark?: {
        /**
         * @default 1
         */
        minCycles?: number;
        /**
         * @default 0
         */
        minMs?: number;
    };
    warmup?: {
        /**
         * @default 1
         */
        minCycles?: number;
        /**
         * @default 0
         */
        minMs?: number;
    };
}
export interface VitestBenchRunnerConfig {
    benchmark: {
        minCycles: number;
        minMs: number;
    };
    warmup: {
        minCycles: number;
        minMs: number;
    };
}
