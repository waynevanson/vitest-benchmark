// almost calculating this in rverse lol
export function deriveResultsConfig(config) {
    return {
        samples: config.latency.average ||
            config.latency.max ||
            config.latency.min ||
            config.latency.percentiles.length > 0 ||
            config.throughput.average ||
            config.throughput.max ||
            config.throughput.min ||
            config.throughput.percentiles.length > 0
            ? {
                enabled: true,
                with: {
                    latency: {
                        measures: config.latency.average ||
                            config.latency.max ||
                            config.latency.min ||
                            config.throughput.average ||
                            config.throughput.max ||
                            config.throughput.min
                            ? {
                                enabled: true,
                                with: {
                                    average: config.latency.average || config.throughput.average
                                        ? {
                                            enabled: true,
                                            with: {
                                                throughput: {
                                                    average: config.throughput.average
                                                }
                                            }
                                        }
                                        : { enabled: false },
                                    max: config.latency.max || config.throughput.min
                                        ? {
                                            enabled: true,
                                            with: {
                                                throughput: { min: config.throughput.min }
                                            }
                                        }
                                        : { enabled: false },
                                    min: config.latency.min || config.throughput.max
                                        ? {
                                            enabled: true,
                                            with: {
                                                throughput: { max: config.throughput.max }
                                            }
                                        }
                                        : { enabled: false }
                                }
                            }
                            : { enabled: false },
                        percentiles: config.latency.percentiles
                    },
                    throughput: {
                        percentiles: config.throughput.percentiles
                    }
                }
            }
            : { enabled: false }
    };
}
export function deriveMeta(samples, cycles, config) {
    if (!config.samples.enabled) {
        return {};
    }
    samples.sort();
    const results = {
        samples,
        // todo: only make when we need to
        throughput: {}
    };
    if (config.samples.with.latency.percentiles.length > 0 ||
        config.samples.with.latency.measures.enabled) {
        results.latency = {};
    }
    if (config.samples.with.latency.measures.enabled) {
        const time = samples.reduce((accu, curr) => accu + curr, 0);
        if (config.samples.with.latency.measures.with.average.enabled) {
            const latencyAverage = time / samples.length;
            results.latency.average = latencyAverage;
            if (config.samples.with.latency.measures.with.average.with.throughput
                .average) {
                const throughputAverage = cycles / latencyAverage;
                results.throughput.average = throughputAverage;
            }
        }
        if (config.samples.with.latency.measures.with.max.enabled) {
            const latencyMax = samples[samples.length] ?? 0;
            results.latency.max = latencyMax;
            if (config.samples.with.latency.measures.with.max.with.throughput.min) {
                const throughputMin = cycles / (latencyMax * samples.length);
                results.throughput.min = throughputMin;
            }
        }
        if (config.samples.with.latency.measures.with.min.enabled) {
            const latencyMin = samples[0] ?? 0;
            results.latency.max = latencyMin;
            if (config.samples.with.latency.measures.with.min.with.throughput.max) {
                const throughputMax = cycles / (latencyMin * samples.length);
                results.throughput.max = throughputMax;
            }
        }
    }
    if (config.samples.with.latency.percentiles.length > 0) {
        const latencyPercentiles = config.samples.with.latency.percentiles.map((percentile) => calculatePercentile(samples, percentile));
        // results.latency!.percentiles = latencyPercentiles
    }
    if (config.samples.with.throughput.percentiles.length > 0) {
        const sampled = samples.map((a) => 1 / a).reverse();
        const throughputPercentiles = config.samples.with.throughput.percentiles.map((percentile) => calculatePercentile(sampled, percentile));
        //  results.throughput?.percentiles= throughputPercentiles
    }
    return results;
}
// for thoughput, we need to change each sample to be a percentage of the cycle or somthing 1/sample ?
// Thanks GPT
function calculatePercentile(samples, percentile) {
    const m = samples.length - 1;
    const r = percentile * m;
    const i = Math.floor(r);
    const f = r - i;
    if (i === m) {
        return samples[i];
    }
    else {
        return samples[i] * (1 - f) + samples[i + 1] * f;
    }
}
