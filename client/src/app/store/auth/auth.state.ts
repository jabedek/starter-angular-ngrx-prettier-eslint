import { AdditionalUserInfo, User, UserCredential } from 'firebase/auth';

export interface AuthState {
  firebase: {
    user: Partial<User> | null | undefined;
    userCredential: Partial<UserCredential> | undefined;
  };
  appAccount: UserAppAccount | undefined;
}

export const initialState: AuthState = {
  firebase: {
    user: undefined,
    userCredential: undefined,
  },
  appAccount: undefined,
};

export type UserAppAccount = {
  id: string;
  googleUid?: string;
  email?: string;
  displayName?: string;
  logged: boolean;
  appFeaturesData: UserAppFeaturesData;
};

export type UserAppFeaturesData = {
  asianPoker: {
    currentSessionId: string;
  };
};
