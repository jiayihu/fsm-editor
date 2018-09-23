export function debounce<F extends (...params: Array<any>) => void>(fn: F, delay: number): F {
  let timer: number;

  return function(this: any, ...args: Array<any>) {
    clearTimeout(timer);
    timer = window.setTimeout(() => fn.apply(this, args), delay);
  } as F;
}

export function generatedId(prefix: string): string {
  /**
   * Poor man's unique id
   * @see {@link https://gist.github.com/gordonbrander/2230317}
   */
  return (
    prefix +
    '_' +
    Math.random()
      .toString(36)
      .substr(2, 9)
  );
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
