/**
 * Finite state, not to be confused with React State
 */
export type FState = {
  coords: SVGPoint;
  text: string;
  style: {
    width: number;
    height: number;
    fontSize: number;
  };
};

export function createFState(coords: SVGPoint): FState {
  return { coords, text: 'State', style: { width: 100, height: 40, fontSize: 24 } };
}

export function isSameFState(a: FState, b: FState): boolean {
  return a.coords.x === b.coords.x && a.coords.y === b.coords.y;
}
