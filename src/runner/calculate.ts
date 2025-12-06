import { collapse, conditional, lazy } from "../utils"
import { VitestBenchRunnerConfig, BenchRunnerMeta } from "./config"

export function calculate(
  config: VitestBenchRunnerConfig["results"],
  context: { samples: Array<number>; cycles: number }
): BenchRunnerMeta | undefined {
  const cycles = lazy(() => context.samples.map((duration) => 1 / duration))

  const totalDuration = lazy(() =>
    context.samples.reduce((accu, curr) => accu + curr, 0)
  )

  const latencyAverage = lazy(() => totalDuration() / context.samples.length)

  const latencyMin = lazy(() =>
    context.samples.reduce((accu, curr) => Math.min(accu, curr))
  )

  const latencyMax = lazy(() =>
    context.samples.reduce((accu, curr) => Math.max(accu, curr))
  )

  const throughputAverage = lazy(() => context.cycles / totalDuration())

  const throughputMin = lazy(
    () => context.cycles / (context.samples.length * latencyMax())
  )

  const throughputMax = lazy(
    () => context.cycles / (context.samples.length * latencyMin())
  )

  const latencyPercentiles = lazy(() =>
    calcPer(context.samples, config.latency.percentiles)
  )

  const latency = collapse({
    average: conditional(config.latency.average, latencyAverage),
    min: conditional(config.latency.min, latencyMin),
    max: conditional(config.latency.max, latencyMax),
    percentiles: conditional(
      config.latency.percentiles.length > 0,
      latencyPercentiles
    )
  })

  const throughputPercentiles = lazy(() =>
    calcPer(cycles(), config.throughput.percentiles)
  )

  const throughput = collapse({
    average: conditional(config.throughput.average, throughputAverage),
    min: conditional(config.throughput.min, throughputMin),
    max: conditional(config.throughput.max, throughputMax),
    percentiles: conditional(
      config.throughput.percentiles.length > 0,
      throughputPercentiles
    )
  })

  const schema = collapse({
    samples: conditional(config.samples, () => context.samples),
    latency,
    throughput
  })

  return schema
}

// Thanks GPT
export function calculatePercentile(
  samples: Array<number>,
  percentile: number
): number {
  const m = samples.length - 1

  const r = percentile * m
  const i = Math.floor(r)
  const f = r - i

  if (i === m) {
    return samples[i]
  } else {
    return samples[i] * (1 - f) + samples[i + 1] * f
  }
}

function calcPer(samples: Array<number>, percentiles: Array<number>) {
  return percentiles.reduce((accu, percentile) => {
    let name = percentile.toPrecision()
    if (name.length === 3) {
      name = percentile.toPrecision(2)
    }
    name = name.slice(2)

    const value = calculatePercentile(samples, percentile)
    accu[name] = value
    return accu
  }, {} as Record<string, number>)
}
