# `vitest-runner-benchmark`

A Vitest runner and reporter that runs benchmarks on existing tests.

## Cost Benefit Analysis

### Benefits

1. Uses existing tests.
2. Removes throws from expect (when using instance bound `expect`).

### Drawbacks

1. Expressions used in assertions are still evaluated.

## General Usage

1. Replace the current runner with this one.
2. Append this reporter to the list of reporters.
