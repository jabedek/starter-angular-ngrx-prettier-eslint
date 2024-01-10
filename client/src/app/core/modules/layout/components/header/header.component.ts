import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@store/app-state';
import { selectBurgerOpen } from '@store/layout/layout.selectors';
import { selectUrlParts } from '@store/router/router.selectors';
import { selectUserLoggedIn } from '@store/auth/auth.selectors';
import { BaseComponent } from '@shared/components/base/base.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent extends BaseComponent {
  burgerOpen$ = this.store.select(selectBurgerOpen);
  currentUrl$ = this.store.select(selectUrlParts);
  userLoggedIn$ = this.store.select(selectUserLoggedIn);
  authLoader$ = this.__layoutService.getLoader('auth');

  constructor(private store: Store<AppState>) {
    super('HeaderComponent');
  }
}
