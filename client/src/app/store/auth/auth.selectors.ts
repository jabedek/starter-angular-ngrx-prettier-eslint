import { AppState } from '@store/app-state';
import { AuthState } from './auth.state';

export const selectAuth = (state: AppState): AuthState => state.auth;
