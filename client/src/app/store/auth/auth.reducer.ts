import { createReducer, on } from '@ngrx/store';
import * as actions from './auth.actions';
import { initialState, AuthState } from './auth.state';

export const featureKey = 'auth';

export const featureState = createReducer(
  initialState,
  on(actions.setFirebaseCurrentUser, (state, { user }): AuthState => {
    return { ...state, firebase: { ...state.firebase, user } };
  }),
  on(actions.setFirebaseUserCredential, (state, { userCredential }): AuthState => {
    return { ...state, firebase: { ...state.firebase, userCredential } };
  }),
  on(actions.setUserAppAccount, (state, { appAccount }): AuthState => {
    return { ...state, appAccount };
  }),
);
