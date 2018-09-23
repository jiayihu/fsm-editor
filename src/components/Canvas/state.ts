import { FState, isSameFState } from '../../domain/fstate';
import { Action, ActionType } from './actions';
import { assertUnreachable } from '../../utils/typescript';

export type State = {
  fstates: FState[];
};

export function reducer(state: State, action: Action): Pick<State, keyof State> | null {
  switch (action.type) {
    case ActionType.ADD_STATE: {
      const fstate = action.payload;
      const isDuplicate = state.fstates.find(x => isSameFState(x, fstate));

      if (isDuplicate) return null;

      return { fstates: [...state.fstates, fstate] };
    }
    case ActionType.EDIT_STATE_TEXT: {
      const { fstate, text } = action.payload;
      const fstates = state.fstates.map(x => {
        if (isSameFState(x, fstate)) {
          return { ...fstate, text };
        }

        return x;
      });

      return { fstates };
    }
    default:
      return assertUnreachable(action);
  }
}
