/**
 * Pipes a value through a series of functions from left to right
 * @example pipe(5, double, addOne) // 11
 */
export const pipe = <T>(...fns: Array<(arg: T) => T>) =>
  (value: T): T => fns.reduce((acc, fn) => fn(acc), value);

/**
 * Creates a piped function that can be called later
 */
export const pipeWith = <T>(...fns: Array<(arg: T) => T>) =>
  (value: T): T => pipe(...fns)(value);
