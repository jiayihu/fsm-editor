import { generatedId } from '../utils/generic';
import { Point } from './geometry';

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

    // Default width and height are calculated using TextRuler with `State`
    style: { width: 72, height: 50, fontSize: 24 }
  };
}

export function isSameFState(a: FState, b: FState): boolean {
  return a.id === b.id;
}
