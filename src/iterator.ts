export function* decrements(max: number, min: number) {
  let number = max
  while (number >= min) {
    yield number--
  }
}

export function* increments(min: number, max: number) {
  let number = min
  while (number <= max) {
    yield number++
  }
}
