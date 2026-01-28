/**
 * Composes functions from right to left
 * @example compose(addOne, double)(5) // 11 (5 * 2 + 1)
 */
export const compose = <T>(...fns: Array<(arg: T) => T>) =>
  (value: T): T => fns.reduceRight((acc, fn) => fn(acc), value);

/**
 * Creates a composed function that can be called later
 */
export const composeWith = <T>(...fns: Array<(arg: T) => T>) =>
  (value: T): T => compose(...fns)(value);
