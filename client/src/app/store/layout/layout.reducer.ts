import { createReducer, on } from '@ngrx/store';
import * as actions from './layout.actions';
import { layoutInitialState, LayoutState } from './layout.state';

export const layoutFeatureKey = 'layout';

export const layoutState = createReducer(
  layoutInitialState,
  on(actions.setBurger, (state, { set }): LayoutState => {
    return { ...state, ui: { ...state.ui, burgerOpen: set === 'toggle' ? !state.ui.burgerOpen : set === 'open' } };
  }),
  on(actions.setLoadingResource, (state, { isLoading, resource }): LayoutState => {
    return { ...state, loadingResource: { isLoading, resource } };
  }),
);
