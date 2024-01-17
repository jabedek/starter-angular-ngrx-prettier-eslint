import { Component } from '@angular/core';
import { FirebaseAuthService } from '@core/firebase/firebase-auth.service';
import { FirebaseDbService, DbRes } from '@core/firebase/firebase-db.service';
import { Store } from '@ngrx/store';
import { BaseComponent } from '@shared/abstracts/base/base.component';
import { AppState } from '@store/app-state';
import { setUserAppAccount } from '@store/auth/auth.actions';
import { selectAuth, selectUserAppAccount } from '@store/auth/auth.selectors';
import { AuthState, UserAppAccount } from '@store/auth/auth.state';
import { Observable, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss'],
})
export class AccountDetailsComponent extends BaseComponent {
  auth$: Observable<AuthState> = this.auth.auth$;
  appAccount$: Observable<UserAppAccount | undefined> = this.auth.appAccount$;

  constructor(
    private store: Store<AppState>,
    private fb: FirebaseDbService,
    private auth: FirebaseAuthService,
  ) {
    super('AccountDetailsComponent');
  }

  changeName(displayName: string, account: UserAppAccount) {
    const user: UserAppAccount = { ...account, displayName };

    this.fb.updateFullOverwrite(DbRes.users, user).then(() => this.store.dispatch(setUserAppAccount({ appAccount: user })));
  }
}
