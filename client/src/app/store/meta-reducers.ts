import { StoreModule, ActionReducer, MetaReducer } from '@ngrx/store';

export function debug(reducer: ActionReducer<any>): ActionReducer<any> {
  return function (state, action) {
    if (action.type.includes('[Admin]')) {
      // console.log(`%c ${action.type}`, 'font-weight: bolder; color: yellow');
    }

    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<any>[] = [debug];
