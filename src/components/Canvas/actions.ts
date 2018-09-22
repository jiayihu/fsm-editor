import { FState } from '../../domain/fstate';

export const enum ActionType {
  ADD_STATE = 'ADD_STATE'
}

export function addState(fstate: FState) {
  return {
    type: ActionType.ADD_STATE,
    payload: fstate
  };
}

export type Action = ReturnType<typeof addState>;
