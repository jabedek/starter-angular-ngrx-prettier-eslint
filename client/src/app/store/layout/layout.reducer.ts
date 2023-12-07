import { createReducer, on } from '@ngrx/store';
import * as actions from './layout.actions';
import { initialState, LayoutState } from './layout.state';

export const featureKey = 'layout';

export const featureState = createReducer(
  initialState,
  on(actions.setBurger, (state, { set }): LayoutState => {
    return { ...state, ui: { ...state.ui, burgerOpen: set === 'toggle' ? !state.ui.burgerOpen : set === 'open' } };
  }),
  on(actions.setLoadingResource, (state, { isLoading, resource }): LayoutState => {
    return { ...state, loadingResource: { isLoading, resource } };
  }),
);
