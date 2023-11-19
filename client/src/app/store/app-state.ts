import { RouterState } from '@angular/router';
import { LayoutState } from 'src/app/store/layout/layout.state';

export interface AppState {
  layout: LayoutState;
  router: RouterState;
}
