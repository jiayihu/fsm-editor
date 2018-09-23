import { FState, isSameFState } from '../../domain/fstate';
import { Action, ActionType } from './actions';
import { assertUnreachable } from '../../utils/typescript';
import { FTransition } from '../../domain/transition';
// import { withDevtools } from './devtools';

type States =
  | { type: 'READONLY' }
  | {
      type: 'DRAGGING';
      fstate: FState;
      position: SVGPoint;
    }
  | {
      type: 'DRAWING_LINE';
      fstate: FState;
      position: SVGPoint;
    };

export type State = States & {
  fstates: FState[];
  ftransitions: FTransition[];
};

export const reducer = function reducer(state: State, action: Action): State | null {
  switch (action.type) {
    case ActionType.RESET_STATE: {
      return { type: 'READONLY', fstates: state.fstates, ftransitions: state.ftransitions };
    }
    case ActionType.SET_DRAG_STATE: {
      const { fstate, position } = action.payload;

      return {
        type: 'DRAGGING',
        fstate,
        position,
        fstates: state.fstates,
        ftransitions: state.ftransitions
      };
    }
    case ActionType.SET_LINE_STATE: {
      const { fstate, position } = action.payload;

      return {
        type: 'DRAWING_LINE',
        fstate,
        position,
        fstates: state.fstates,
        ftransitions: state.ftransitions
      };
    }
    case ActionType.ADD_STATE: {
      const fstate = action.payload;
      const isDuplicate = state.fstates.find(x => isSameFState(x, fstate));

      if (isDuplicate) return null;

      return {
        type: 'READONLY',
        fstates: [...state.fstates, fstate],
        ftransitions: state.ftransitions
      };
    }
    case ActionType.EDIT_STATE: {
      const fstate = action.payload;
      const fstates = state.fstates.map(x => {
        if (isSameFState(x, fstate)) {
          return fstate;
        }

        return x;
      });

      return { type: 'READONLY', fstates, ftransitions: state.ftransitions };
    }
    default:
      return assertUnreachable(action);
  }
};
