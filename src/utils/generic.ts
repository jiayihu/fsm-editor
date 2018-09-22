export function debounce<F extends (...params: Array<any>) => void>(fn: F, delay: number): F {
  let timer: number;

  return function(this: any, ...args: Array<any>) {
    clearTimeout(timer);
    timer = window.setTimeout(() => fn.apply(this, args), delay);
  } as F;
}

/**
 * Type `: {}` is equivalent to `: object | string | boolean | symbol | number`
 * or Flow's `: mixed`
 */
export function isObject(value: {}): value is object {
  return typeof value === 'object' && !Array.isArray(value) && value !== null;
}

export function noop() {
  // noop
}
