import * as v from "valibot";
const warmup = v.object({
    minCycles: v.pipe(v.exactOptional(v.number(), 0), v.minValue(0)),
    minMs: v.pipe(v.exactOptional(v.number(), 0), v.minValue(0))
});
const benchmark = v.object({
    minCycles: v.pipe(v.exactOptional(v.number(), 1), v.minValue(1)),
    minMs: v.pipe(v.exactOptional(v.number(), 0), v.minValue(0))
});
const config = v.object({
    benchmark: v.exactOptional(benchmark, v.getDefaults(benchmark)),
    warmup: v.exactOptional(warmup, v.getDefaults(warmup))
});
export const schema = v.optional(config, v.getDefaults(config));
