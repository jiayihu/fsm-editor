import { FState } from '../../domain/fstate';

export const enum ActionType {
  RESET_STATE = 'RESET_STATE',
  SET_DRAG_STATE = 'SET_DRAG_STATE',
  SET_LINE_STATE = 'SET_LINE_STATE',
  ADD_STATE = 'ADD_STATE',
  EDIT_STATE = 'EDIT_STATE'
}

export function resetState() {
  return { type: ActionType.RESET_STATE as ActionType.RESET_STATE };
}

export function setDragState(fstate: FState, position: SVGPoint) {
  return {
    type: ActionType.SET_DRAG_STATE as ActionType.SET_DRAG_STATE,
    payload: { fstate, position }
  };
}

export function setLineState(fstate: FState, position: SVGPoint) {
  return {
    type: ActionType.SET_LINE_STATE as ActionType.SET_LINE_STATE,
    payload: { fstate, position }
  };
}

export function addState(fstate: FState) {
  return {
    type: ActionType.ADD_STATE as ActionType.ADD_STATE,
    payload: fstate
  };
}

export function editState(fstate: FState) {
  return {
    type: ActionType.EDIT_STATE as ActionType.EDIT_STATE,
    payload: fstate
  };
}

export type Action =
  | ReturnType<typeof resetState>
  | ReturnType<typeof setDragState>
  | ReturnType<typeof setLineState>
  | ReturnType<typeof addState>
  | ReturnType<typeof editState>;
