import { generatedId } from '../utils/generic';

/**
 * Finite state, not to be confused with React State
 */
export type FState = {
  id: string;
  coords: SVGPoint;
  text: string;
  style: {
    width: number;
    height: number;
    fontSize: number;
  };
};

export function createFState(coords: SVGPoint): FState {
  return {
    id: generatedId('fstate'),
    coords,
    text: 'State',
    style: { width: 100, height: 48, fontSize: 24 }
  };
}

export function isSameFState(a: FState, b: FState): boolean {
  return a.id === b.id;
}
