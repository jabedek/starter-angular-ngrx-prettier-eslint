import { AppState } from '@store/app-state';
import { AppFirebaseUser, AuthState } from './auth.state';
import { createSelector } from '@ngrx/store';

export const selectAuth = (state: AppState): AuthState => state.auth;
export const selectUserLoggedIn = createSelector(selectAuth, (state: AuthState): boolean => !!state.firebase.user?.email);
export const selectUserBasicData = createSelector(selectAuth, (state: AuthState): AppFirebaseUser | undefined =>
  state.firebase.user
    ? {
        uid: state.firebase.user?.uid,
        email: state.firebase.user?.email || undefined,
        displayName: state.firebase.user?.displayName || undefined,
      }
    : undefined,
);
