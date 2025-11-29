import path from "node:path"
import { describe, expect, test } from "vitest"
import { runVitest } from "./lib"

describe("task-states", () => {
  test("should contain skipped tests", async () => {
    const vitest = await runVitest(
      path.join(import.meta.dirname, "task-states"),
      "skip"
    )

    expect(vitest).toHaveNumberOfTests(1)
    expect(vitest).not.toHaveFailedTests()
    expect(vitest).toHaveSkippedTests()
  })

  test("should contain skipped tests", async () => {
    const vitest = await runVitest(
      path.join(import.meta.dirname, "task-states"),
      "only"
    )

    expect(vitest).toHaveNumberOfTests(2)
    expect(vitest).not.toHaveFailedTests()
    expect(vitest).toHaveSkippedTests()
  }, 10_000)
})
