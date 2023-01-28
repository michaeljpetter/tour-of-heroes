
export class AutoMap<K, V> extends Map<K, V> {
  private readonly factory: (key: K) => V;

  constructor(
    factory: (key: K) => V,
    entries?: readonly (readonly [K, V])[] | null
  ) {
    super(entries);
    this.factory = factory;
  }

  override get(key: K): V {
    return super.has(key)
      ? super.get(key)!
      : (value => (super.set(key, value), value))(this.factory(key));
  }
}
