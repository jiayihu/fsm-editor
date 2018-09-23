import { FState } from '../../domain/fstate';

export const enum ActionType {
  ADD_STATE = 'ADD_STATE',
  EDIT_STATE_TEXT = 'EDIT_STATE_TEXT'
}

export function addState(fstate: FState) {
  return {
    type: ActionType.ADD_STATE as ActionType.ADD_STATE,
    payload: fstate
  };
}

export function editStateText(fstate: FState, text: string) {
  return {
    type: ActionType.EDIT_STATE_TEXT as ActionType.EDIT_STATE_TEXT,
    payload: { fstate, text }
  };
}

export type Action = ReturnType<typeof addState> | ReturnType<typeof editStateText>;
