import { createSelector } from '@ngrx/store';
import { LayoutState } from './layout.state';
import { AppState } from '../app-state';

export const selectLayout = (state: AppState): LayoutState => state.layout;

export const selectBurgerOpen = createSelector(selectLayout, (state: LayoutState) => state.ui.burgerOpen);
export const selectLoading = createSelector(selectLayout, (state: LayoutState) => state.loadingResource);
