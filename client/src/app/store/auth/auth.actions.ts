import { createAction, props } from '@ngrx/store';
import { User, UserCredential } from 'firebase/auth';
import { UserAppAccount } from './auth.state';

export const setFirebaseCurrentUser = createAction(
  '[Firebase Service] Set Firebase Current User',
  props<{ user: Partial<User> | null | undefined }>(),
);

export const setFirebaseUserCredential = createAction(
  '[Firebase Service] Set Firebase User Credential',
  props<{ userCredential: Partial<UserCredential> | undefined }>(),
);

export const setUserAppAccount = createAction(
  '[Firebase Service] Set User App Account',
  props<{ appAccount: UserAppAccount | undefined }>(),
);
