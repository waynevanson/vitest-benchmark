export function calculate(samples, cycles) {
    const time = sum(samples);
    const latency = {
        minimum_value: Math.min(...samples),
        maximum_value: Math.max(...samples),
        value: time / samples.length
    };
    // todo: not sure if this is correct
    const throughput = {
        value: cycles / time,
        minimum_value: sum(repeat(latency.minimum_value, samples.length)) / time,
        maximum_value: sum(repeat(latency.maximum_value, samples.length)) / time
    };
    return {
        latency,
        throughput
    };
}
function sum(iterable) {
    let number = 0;
    for (const item of iterable) {
        number += item;
    }
    return number;
}
function* repeat(item, count) {
    for (let counter = 1; counter <= count; counter++) {
        yield item;
    }
}
