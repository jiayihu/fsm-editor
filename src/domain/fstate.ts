import { generatedId } from '../utils/generic';
import { Point } from './point';

/**
 * Finite state, not to be confused with React State
 */
export type FState = {
  id: string;
  coords: Point;
  text: string;
  style: {
    width: number;
    height: number;
    fontSize: number;
  };
};

export function createFState(coords: Point): FState {
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
