import { AppState } from '@store/app-state';
import { UserAppAccount, AuthState } from './auth.state';
import { createSelector } from '@ngrx/store';

export const selectAuth = (state: AppState): AuthState => state.auth;
export const selectUserLoggedIn = createSelector(selectAuth, (state: AuthState): boolean => !!state.firebase.user?.email);
export const selectUserAppAccount = createSelector(
  selectAuth,
  (state: AuthState): UserAppAccount | undefined => state.appAccount,
);
