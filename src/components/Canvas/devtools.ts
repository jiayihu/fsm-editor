import { State } from './state';
import { Action } from './actions';

/**
 * Basic support of Redux devtools
 */

const extension: any = (window as any).__REDUX_DEVTOOLS_EXTENSION__;
let devTools: any;

if (extension) {
  devTools = extension.connect({ name: 'Canvas' });
  devTools.init({ type: 'READONLY', fstates: [] });
}

type Reducer = (state: State, action: Action) => State | null;

export function withDevtools(reducer: Reducer): Reducer {
  return (state: State, action: Action) => {
    const newState = reducer(state, action);

    devTools.send(action, newState);

    return newState;
  };
}
