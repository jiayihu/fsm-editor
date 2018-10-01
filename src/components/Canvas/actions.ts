import { FState } from '../../domain/fstate';
import { FTransition } from '../../domain/transition';
import { Point } from '../../domain/geometry';

export const enum ActionType {
  RESET_STATE = 'RESET_STATE',
  SET_DRAG_STATE = 'SET_DRAG_STATE',
  SET_DELETE_STATE = 'SET_DELETE_STATE',
  SET_LINE_STATE = 'SET_LINE_STATE',
  ADD_STATE = 'ADD_STATE',
  EDIT_STATE = 'EDIT_STATE',
  DELETE_STATE = 'DELETE_STATE',
  ADD_TRANSITION = 'ADD_TRANSITION',
  EDIT_TRANSITION = 'EDIT_TRANSITION',
  DELETE_TRANSITION = 'DELETE_TRANSITION'
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

export function setDeleteState() {
  return {
    type: ActionType.SET_DELETE_STATE as ActionType.SET_DELETE_STATE
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

export function deleteState(fstate: FState) {
  return {
    type: ActionType.DELETE_STATE as ActionType.DELETE_STATE,
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

export function deleteTransition(ftranstion: FTransition) {
  return {
    type: ActionType.DELETE_TRANSITION as ActionType.DELETE_TRANSITION,
    payload: ftranstion
  };
}

export type Action =
  | ReturnType<typeof resetState>
  | ReturnType<typeof setDragState>
  | ReturnType<typeof setDeleteState>
  | ReturnType<typeof setLineState>
  | ReturnType<typeof addState>
  | ReturnType<typeof editState>
  | ReturnType<typeof deleteState>
  | ReturnType<typeof addTransition>
  | ReturnType<typeof editTransition>
  | ReturnType<typeof deleteTransition>;
