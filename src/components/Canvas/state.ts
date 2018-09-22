import { FState } from '../../domain/fstate';
import { Action, ActionType } from './actions';
import { assertUnreachable } from '../../utils/typescript';

export type State = {
  fstates: FState[];
};

export function reducer(state: State, action: Action): Pick<State, keyof State> | null {
  switch (action.type) {
    case ActionType.ADD_STATE: {
      const fstate = action.payload;
      const isDuplicate = state.fstates.find(x => {
        return x.coords.x === fstate.coords.x && x.coords.y === fstate.coords.y;
      });

      if (isDuplicate) return null;

      return { fstates: [...state.fstates, fstate] };
    }
    default:
      return assertUnreachable(action.type);
  }
}
