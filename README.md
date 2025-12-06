# `@waynevanson/vitest-benchmark`

A Vitest runner and reporter that runs benchmarks on existing tests.

This is not endorsed by Vitest, please use at your own risk.

Development is being tested against [AriaKit](https://github.com/ariakit/ariakit) project in this [pull request](https://github.com/ariakit/ariakit/pull/4415).

## Cost Benefit Analysis

### Benefits

1. Uses existing tests.

### Drawbacks

1. Keeps assertions in place.
2. Likely not endorsed by Vitest team.

## Installation

```sh
# Use relevant commands to your package manager.
npm install @waynevanson/vitest-benchmark
```

There are 2 exports worth configuring:

1. `@waynevanson/vitest-benchmark/runner`
1. `@waynevanson/vitest-benchmark/reporter/bmf`

## `@waynevanson/vitest-benchmark/runner`

Configure runner for use in Vitest.

> NOTE: Without a reporter, results for benchmarks will not be shown.
> A Reporter needs to be configured that consumes these results.

```ts
# Config file
# ie. vitest.config.ts or vite.config.ts

import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // required. You'll likely want to control this with an environment variable
    runner: "@waynevanson/vitest-benchmark/runner"
    provide: {
      // Configuration defaults, recommendations in comments.
      benchrunner: {
        benchmark: {
          // ~1000
          minCycles: 1,
          minMs: 0
        },
        warmup: {
          // ~50
          minCycles: 0,
          minMs: 0
        },
        // Defaults to undefined and calculates no benchmarks.
        // These are attached to each task as metadata with `task.meta.benchrunner.*`
        results: {
          // takes up a lot of memory, not recommended.
          samples: false,
          latency: {
            average: false,
            min: false,
            max: false,
            // [0.999] for 99.9th percentile.
            percentiles: []
          },
          throughput: {
            average: false,
            min: false,
            max: false,
            // [0.999] for 99.9th percentile.
            percentiles: []
          }
        }
      }
    }
  }
})
```

## `@waynevanson/vitest-benchmark/reporter/bmf`

Allows integration with [`Bencher`](https://bencher.dev/) for CI integration.

1. Run via Vitest CLI.

```sh
vitest --reporter="@waynevanson/reporter/bmf"
```

This will output to minified JSON via stdout.

2. Send to Bencher.

todo:

### Steps

## FAQ

## Vitest Bench Mode

> Vitest already has a bench mode, which is a runner. Why create a new runner?

Because the offical bench runner doesn't call your hooks and doesn't call your existing tests.
