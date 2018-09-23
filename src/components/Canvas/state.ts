import { FState, isSameFState } from '../../domain/fstate';
import { Action, ActionType } from './actions';
import { assertUnreachable } from '../../utils/typescript';

type States =
  | { type: 'READONLY' }
  | {
      type: 'EDITING';
      text: string;
    }
  | {
      type: 'DRAGGING';
      fstate: FState;
      position: SVGPoint;
    };

export type State = States & {
  fstates: FState[];
};

export function reducer(state: State, action: Action): State | null {
  switch (action.type) {
    case ActionType.RESET_STATE: {
      return { type: 'READONLY', fstates: state.fstates };
    }
    case ActionType.SET_DRAG_STATE: {
      const { fstate, position } = action.payload;

      return { type: 'DRAGGING', fstate, position, fstates: state.fstates };
    }
    case ActionType.ADD_STATE: {
      const fstate = action.payload;
      const isDuplicate = state.fstates.find(x => isSameFState(x, fstate));

      if (isDuplicate) return null;

      return { type: 'READONLY', fstates: [...state.fstates, fstate] };
    }
    case ActionType.EDIT_STATE: {
      const fstate = action.payload;
      const fstates = state.fstates.map(x => {
        if (isSameFState(x, fstate)) {
          return fstate;
        }

        return x;
      });

      return { type: 'READONLY', fstates };
    }
    default:
      return assertUnreachable(action);
  }
}
