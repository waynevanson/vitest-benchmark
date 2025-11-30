import * as v from "valibot"

const benchmark = v.object({
  minCycles: v.pipe(v.exactOptional(v.number(), 1), v.minValue(1)),
  minMs: v.pipe(v.exactOptional(v.number(), 0), v.minValue(0))
})

const warmup = v.object({
  minCycles: v.pipe(v.exactOptional(v.number(), 0), v.minValue(0)),
  minMs: v.pipe(v.exactOptional(v.number(), 0), v.minValue(0))
})

const disabled = v.exactOptional(v.boolean(), false)

const percentiles = v.pipe(
  v.array(v.pipe(v.number(), v.gtValue(0))),
  v.minLength(0)
)

const measure = v.object({
  average: disabled,
  min: disabled,
  max: disabled,
  // this could be 999999 or 0000001, round up the decimal places with log and percentage of that.
  percentiles: v.exactOptional(percentiles, v.getDefaults(percentiles))
})

const measures = v.exactOptional(measure, v.getDefaults(measure))

const results = v.object({
  samples: disabled,
  latency: measures,
  throughput: measures
})

const config = v.object({
  benchmark: v.exactOptional(benchmark, v.getDefaults(benchmark)),
  warmup: v.exactOptional(warmup, v.getDefaults(warmup))
  //   results: v.exactOptional(results, v.getDefaults(results))
})

export const schema = v.optional(config, v.getDefaults(config))

export interface VitestBenchRunnerUserConfig {
  benchmark?: {
    /**
     * @default 1
     */
    minCycles?: number

    /**
     * @default 0
     */
    minMs?: number
  }
  warmup?: {
    /**
     * @default 0
     */
    minCycles?: number

    /**
     * @default 0
     */
    minMs?: number
  }
}

export interface VitestBenchRunnerConfig {
  benchmark: {
    minCycles: number
    minMs: number
  }
  warmup: {
    minCycles: number
    minMs: number
  }
}
