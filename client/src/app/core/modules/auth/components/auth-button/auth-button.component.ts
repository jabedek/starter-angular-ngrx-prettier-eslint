import { Component, Input } from '@angular/core';
import { AuthService } from '../../auth.service';
import { selectUserLoggedIn } from '@store/auth/auth.selectors';
import { AppState } from '@store/app-state';
import { Store } from '@ngrx/store';
import { BaseComponent } from '@shared/components/base/base.component';
import { Subscription, map, takeUntil, tap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-button',
  templateUrl: './auth-button.component.html',
  styleUrls: ['./auth-button.component.scss'],
})
export class AuthButtonComponent extends BaseComponent {
  @Input() redirectToAfter = '';
  private userLoggedIn$ = this.store.select(selectUserLoggedIn).pipe(takeUntil(this.__destroy));
  private autoDetailsSubscription: Subscription | undefined;

  details = {
    logged: false,
    mode: 'login',
    label: 'Login',
  };

  @Input() set mode(mode: 'auto' | 'login' | 'logout') {
    this.autoDetailsSubscription?.unsubscribe();
    if (mode === 'login') {
      this.details = {
        logged: false,
        mode: 'login',
        label: 'Login',
      };
    }

    if (mode === 'logout') {
      this.details = {
        logged: true,
        mode: 'logout',
        label: 'Logout',
      };
    }

    if (mode === 'auto') {
      this.autoDetailsSubscription = this.userLoggedIn$
        .pipe(
          map((logged) => {
            const mode = logged ? 'logut' : 'login';
            const label = logged ? 'Logout' : 'Login';
            return { logged, mode, label };
          }),
        )
        .subscribe((details) => (this.details = details));
    }
  }

  constructor(
    private auth: AuthService,
    private store: Store<AppState>,
    private router: Router,
  ) {
    super('AuthButtonComponent');
  }

  authAction() {
    switch (this.details.mode) {
      case 'login':
        this.auth.refreshLogin(true, this.redirectToAfter);
        break;
      case 'logout':
        this.auth.logout(this.redirectToAfter);
        break;
      default:
        break;
    }
  }
}
