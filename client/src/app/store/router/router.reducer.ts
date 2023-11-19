import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { ActionReducerMap } from '@ngrx/store';

export const reducers: ActionReducerMap<{ router: RouterReducerState<any> }> = {
  router: routerReducer,
};
