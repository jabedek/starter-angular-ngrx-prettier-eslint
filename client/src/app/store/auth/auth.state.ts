import { AdditionalUserInfo, User, UserCredential } from 'firebase/auth';

export interface AuthState {
  firebase: {
    user: Partial<User> | null | undefined;
    userCredential: Partial<UserCredential> | undefined;
  };
}

export const initialState: AuthState = {
  firebase: {
    user: undefined,
    userCredential: undefined,
  },
};
