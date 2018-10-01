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

/**
 * Inaccurate but easy way to get width and height based on the text. Values
 * cannot be strings.
 */
export function getTextWidth(text: string): number {
  const rows = text.split('\n');
  const maxRowLength = Math.max(...rows.map(x => x.length));

  /**
   * width = (# of chars * 10px) + padding
   * @see {@link https://www.quirksmode.org/css/units-values/fontdependent.html}
   */
  return maxRowLength * 9.8 + 24;
}
export function getTextHeight(text: string): number {
  const rows = text.split('\n');

  // height = ((# of rows * line-height) + padding) * 1rem
  return (rows.length * 1 + 2) * 16;
}

export function createFState(coords: Point): FState {
  return {
    id: generatedId('fstate'),
    coords,
    text: 'State',
    style: { width: getTextWidth('State'), height: getTextHeight('State'), fontSize: 24 }
  };
}

export function isSameFState(a: FState, b: FState): boolean {
  return a.id === b.id;
}
