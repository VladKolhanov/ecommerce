export type PlainObject<TValue = unknown> = Record<PropertyKey, TValue>
export type ValueOf<T extends PlainObject> = T[keyof T]
export type ValueOfSet<T> = T extends Set<infer V> ? V : never
