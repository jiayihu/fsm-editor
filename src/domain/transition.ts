import { generatedId } from '../utils/generic';
import { FState } from './fstate';

/**
 * Finite state, not to be confused with React State
 */
export type FTransition = {
  id: string;
  fromState: FState;
  toState: FState;
  text: string;
  style: {};
};

export function createFTransition(fromState: FState, toState: FState): FTransition {
  return {
    id: generatedId('ftransition'),
    fromState,
    toState,
    text: 'Hello',
    style: {}
  };
}

export function isSameFTransition(a: FTransition, b: FTransition): boolean {
  return a.id === b.id;
}
