import { FState, isSameFState } from '../../domain/fstate';
import { Action, ActionType } from './actions';
import { assertUnreachable } from '../../utils/typescript';
import { FTransition, isSameFTransition } from '../../domain/transition';
import { Point } from '../../domain/geometry';
// import { withDevtools } from './devtools';

type States =
  | { type: 'READONLY' }
  | { type: 'EDITING' } // It's editing the fstate or the ftransition
  | {
      type: 'DRAGGING';
      fstate: FState;
      position: Point;
    }
  | { type: 'DELETING' }
  | {
      type: 'DRAWING_LINE';
      fstate: FState;
      position: Point;
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
    case ActionType.SET_EDITING_STATE: {
      return {
        type: 'EDITING',
        fstates: state.fstates,
        ftransitions: state.ftransitions
      };
    }
    case ActionType.SET_DELETE_STATE: {
      return {
        type: 'DELETING',
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

      // Update also in transitions involving the changed state
      const ftransitions = state.ftransitions.map(ftransition => {
        if (isSameFState(ftransition.fromState, fstate)) {
          return { ...ftransition, fromState: fstate };
        }

        if (isSameFState(ftransition.toState, fstate)) {
          return { ...ftransition, toState: fstate };
        }

        return ftransition;
      });

      return { type: 'READONLY', fstates, ftransitions };
    }
    case ActionType.DELETE_STATE: {
      const fstate = action.payload;
      const fstates = state.fstates.filter(x => !isSameFState(x, fstate));
      const ftransitions = state.ftransitions.filter(
        x => !isSameFState(x.fromState, fstate) && !isSameFState(x.toState, fstate)
      );

      return {
        type: 'READONLY',
        fstates,
        ftransitions: ftransitions
      };
    }
    case ActionType.ADD_TRANSITION: {
      const ftransition = action.payload;
      const isDuplicate = state.ftransitions.find(x => isSameFTransition(x, ftransition));

      if (isDuplicate) return null;

      return {
        type: 'READONLY',
        fstates: state.fstates,
        ftransitions: [...state.ftransitions, ftransition]
      };
    }
    case ActionType.EDIT_TRANSITION: {
      const ftransition = action.payload;
      const ftransitions = state.ftransitions.map(x => {
        if (isSameFTransition(x, ftransition)) {
          return ftransition;
        }

        return x;
      });

      return { type: 'READONLY', ftransitions, fstates: state.fstates };
    }
    case ActionType.DELETE_TRANSITION: {
      const ftransition = action.payload;
      const ftransitions = state.ftransitions.filter(x => !isSameFTransition(x, ftransition));

      return { type: 'READONLY', ftransitions, fstates: state.fstates };
    }
    default:
      return assertUnreachable(action);
  }
};
