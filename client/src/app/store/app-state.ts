import { RouterState } from '@angular/router';
import { LayoutState } from 'src/app/store/layout/layout.state';
import { AuthState } from './auth/auth.state';

export interface AppState {
  auth: AuthState;
  layout: LayoutState;
  router: RouterState;
}
