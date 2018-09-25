import { FState } from '../../domain/fstate';
import { FTransition } from '../../domain/transition';
import { Point } from '../../domain/geometry';

export const enum ActionType {
  RESET_STATE = 'RESET_STATE',
  SET_DRAG_STATE = 'SET_DRAG_STATE',
  SET_LINE_STATE = 'SET_LINE_STATE',
  ADD_STATE = 'ADD_STATE',
  EDIT_STATE = 'EDIT_STATE',
  ADD_TRANSITION = 'ADD_TRANSITION',
  EDIT_TRANSITION = 'EDIT_TRANSITION'
}

export function resetState() {
  return { type: ActionType.RESET_STATE as ActionType.RESET_STATE };
}

export function setDragState(fstate: FState, position: Point) {
  return {
    type: ActionType.SET_DRAG_STATE as ActionType.SET_DRAG_STATE,
    payload: { fstate, position }
  };
}

export function setLineState(fstate: FState, position: Point) {
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

export function addTransition(transition: FTransition) {
  return {
    type: ActionType.ADD_TRANSITION as ActionType.ADD_TRANSITION,
    payload: transition
  };
}

export function editTransition(ftransition: FTransition) {
  return {
    type: ActionType.EDIT_TRANSITION as ActionType.EDIT_TRANSITION,
    payload: ftransition
  };
}

export type Action =
  | ReturnType<typeof resetState>
  | ReturnType<typeof setDragState>
  | ReturnType<typeof setLineState>
  | ReturnType<typeof addState>
  | ReturnType<typeof editState>
  | ReturnType<typeof addTransition>
  | ReturnType<typeof editTransition>;
