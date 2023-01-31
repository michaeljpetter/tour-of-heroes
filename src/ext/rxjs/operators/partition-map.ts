import { identity, map, OperatorFunction } from 'rxjs';

export function partitionMap<T, U extends T, R1, R2>(
  predicate: (value: T, index: number) => value is U,
  projectTrue: (value: U) => R1,
  projectFalse: (value: T) => R2,
): OperatorFunction<T, R1 | R2>;

export function partitionMap<T, R1, R2>(
  predicate: (value: T, index: number) => boolean,
  projectTrue: (value: T) => R1,
  projectFalse: (value: T) => R2,
): OperatorFunction<T, R1 | R2>;

export function partitionMap<T, R1, R2>(
  predicate: (value: T, index: number) => boolean,
  projectTrue: (value: T) => R1,
  projectFalse: (value: T) => R2,
): OperatorFunction<T, R1 | R2> {
  return map((value: T, index) =>
    predicate(value, index)
      ? projectTrue(value)
      : projectFalse(value)
  );
}


export function mapIf<T, U extends T, R>(
  predicate: (value: T, index: number) => value is U,
  project: (value: U) => R
): OperatorFunction<T, T | R>;

export function mapIf<T, R>(
  predicate: (value: T, index: number) => boolean,
  project: (value: T) => R,
): OperatorFunction<T, T | R>;

export function mapIf<T, R>(
  predicate: (value: T, index: number) => boolean,
  project: (value: T) => R,
): OperatorFunction<T, T | R> {
  return partitionMap(predicate, project, identity);
}


export function mapNonNil<T, U extends NonNullable<T>, R>(
  project: (value: U) => R
): OperatorFunction<T, Exclude<T, U> | R>;

export function mapNonNil<T, U extends NonNullable<T>, R>(
  project: (value: U) => R
): OperatorFunction<T, Exclude<T, U> | R> {
  return partitionMap(
    (value: T): value is U => value != null,
    project,
    identity as (value: T) => Exclude<T, U>
  );
}
