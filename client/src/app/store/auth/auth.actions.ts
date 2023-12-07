import { createAction, props } from '@ngrx/store';
import { User, UserCredential } from 'firebase/auth';

export const setFirebaseCurrentUser = createAction(
  '[Firebase] Set Firebase Current User',
  props<{ user: Partial<User> | null | undefined }>(),
);

export const setFirebaseUserCredential = createAction(
  '[Firebase] Set Firebase User Credential',
  props<{ userCredential: Partial<UserCredential> | undefined }>(),
);
