type Calculation = {
  minimum_value: number
  maximum_value: number
  value: number
}

export interface Calculations {
  latency: Calculation
  throughput: Calculation
}

export function calculate(
  samples: Array<number>,
  cycles: number
): Calculations {
  const time = sum(samples)

  const latency: Calculation = {
    minimum_value: Math.min(...samples),
    maximum_value: Math.max(...samples),
    value: time / samples.length
  }

  // todo: not sure if this is correct
  const throughput: Calculation = {
    value: cycles / time,
    minimum_value: sum(repeat(latency.minimum_value, samples.length)) / time,
    maximum_value: sum(repeat(latency.maximum_value, samples.length)) / time
  }

  return {
    latency,
    throughput
  }
}

function sum(iterable: Iterable<number>): number {
  let number = 0

  for (const item of iterable) {
    number += item
  }

  return number
}

function* repeat<T>(item: T, count: number) {
  for (let counter = 1; counter <= count; counter++) {
    yield item
  }
}
