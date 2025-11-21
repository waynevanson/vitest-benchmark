import { recordArtifact } from "@vitest/runner";
import { VitestTestRunner } from "vitest/runners";
import { getFn, getHooks, setHooks } from "vitest/suite";
import { createBeforeEachCycle } from "./hooks.js";
/**
 * @summary
 * A `VitestRunner` that runs tests as benchmarks.
 */
// todo: remove assertions via vite plugin?
export class VitestBenchRunner extends VitestTestRunner {
    // todo: ensure this can take multiple things like minimum time of cycles.
    #config;
    // Allowing Vitest to run the `each` hooks means we don't have access to the
    // cleanup function from `beforeEach`.
    // Instead we'll move them here before Vitest can read them,
    // and call them per cycle.
    #hooks = new WeakMap();
    #files = new Map();
    constructor(config) {
        if (config.sequence.concurrent) {
            throw new Error("Expected config.sequence.concurrent to be falsey");
        }
        if (config.sequence.shuffle) {
            throw new Error("Expected config.sequence.shuffle to be falsey");
        }
        super(config);
        const options = JSON.parse(process.env["VITEST_RUNNER_BENCHMARK_OPTIONS"] ?? "{}");
        const bcycles = options?.benchmark?.cycles || 64;
        const wcycles = options?.warmup?.cycles || 10;
        this.#config = {
            benchmark: { cycles: bcycles },
            warmup: { cycles: wcycles }
        };
    }
    // Move `{before,after}Each` hooks into runner so Vitest can't run them automatically.
    // This may cause some issues for some Vitest internals but we we can get to that later.
    async onBeforeRunSuite(suite) {
        const hooks = getHooks(suite);
        this.#hooks.set(suite, {
            afterEach: hooks.afterEach,
            beforeEach: hooks.beforeEach
        });
        setHooks(suite, {
            ...hooks,
            beforeEach: [],
            afterEach: []
        });
        await super.onBeforeRunSuite(suite);
    }
    async runTask(test) {
        const fn = getFn(test);
        const beforeEachCycle = createBeforeEachCycle(test, {
            sequence: this.config.sequence.hooks,
            getHooks: this.getHooks.bind(this)
        });
        for (let count = 1; count <= this.#config.warmup.cycles; count++) {
            const afterEachCycle = await beforeEachCycle();
            await fn();
            await afterEachCycle();
        }
        for (let count = 1; count <= this.#config.benchmark.cycles; count++) {
            const afterEachCycle = await beforeEachCycle();
            // todo: performance buffer will run out of room.
            // todo: log a cycle event
            performance.mark(`${test.id}:open:${count}`);
            await fn();
            performance.mark(`${test.id}:shut:${count}`);
            // todo: log a cycle event
            await afterEachCycle();
        }
        await recordArtifact(test, {
            type: "benchmark:samples",
            attachments: [this.createBenchmarkAttachment.call(this, test.id)]
        });
    }
    getHooks(suite) {
        const hooks = this.#hooks.get(suite);
        if (!hooks) {
            throw new Error(`Expected to get hooks for the suite ${suite.name}`);
        }
        return hooks;
    }
    // Send length of cycles to a reporter
    createBenchmarkAttachment(id) {
        // todo: handle range for skipped tests
        const samples = Array.from({ length: this.#config.benchmark.cycles }, (_, index) => {
            const counter = index + 1;
            const open = `${id}:open:${counter}`;
            const shut = `${id}:shut:${counter}`;
            const measure = performance.measure(open, shut);
            return measure.duration;
        });
        const body = JSON.stringify(samples);
        return { contentType: "application/json", body };
    }
}
const ARTEFACT_BENCHMARK = Symbol("ARTEFACT_BENCHMARK");
function* window(iterator) {
    let a = iterator.next();
    let b = iterator.next();
    while (!a.done && !b.done) {
        yield [a.value, b.value];
        a = b;
        b = iterator.next();
    }
}
export default VitestBenchRunner;
