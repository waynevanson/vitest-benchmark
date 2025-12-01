export class HashMap<K, V> extends Map<K, V> {
  enforce(key: K) {
    if (this.has(key)) {
      throw new Error(`Expected ${key} not to be present in HashMap`)
    }

    return this.get(key)!
  }

  setOnce(key: K, value: V) {
    if (!this.has(key)) {
      this.set(key, value)
    }

    return this.get(key)!
  }
}

export class DefaultMap<K, V> extends HashMap<K, V> {
  constructor(
    private create: () => V,
    iterable?: Iterable<readonly [K, V]> | null
  ) {
    super(iterable)
  }

  ensure(key: K) {
    if (!this.has(key)) {
      this.set(key, this.create())
    }

    return this.get(key)!
  }
}
