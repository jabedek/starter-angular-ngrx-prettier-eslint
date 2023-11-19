import { createAction, props } from '@ngrx/store';

export const setBurger = createAction('[Header Nav] Set Burger ', props<{ set: 'open' | 'close' | 'toggle' }>());

export const setLoadingResource = createAction('[UI] Set Loading', props<{ isLoading: boolean; resource: string }>());
