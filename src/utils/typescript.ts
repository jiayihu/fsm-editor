/**
 * For exaustive checks with string enums
 * @see {@link https://stackoverflow.com/questions/39419170/how-do-i-check-that-a-switch-block-is-exhaustive-in-typescript}
 */
export function assertUnreachable(x: never): never {
  throw new Error("Didn't expect to get here");
}

/**
 * `unknown` is super-type of everything in TS and will throw if used anywhere
 * except as "boolean" checks in `if (unknown)` or `unknown ? 1 : 2`
 * `never` is instead sub-type of everything in TS, therefore it won't throw
 * if used as any other type.
 */
export type EqualTypes<A, B> = A extends B ? A : unknown;

export function notEmpty<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}
