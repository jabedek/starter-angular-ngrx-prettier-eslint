import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FirebaseAuthService } from '@core/firebase/firebase-auth.service';
import { Store } from '@ngrx/store';
import { BaseComponent } from '@shared/abstracts/base/base.component';
import { AppState } from '@store/app-state';
import { selectUserAppAccount, selectUserLoggedIn } from '@store/auth/auth.selectors';
import { EMPTY, filter, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-account-display',
  templateUrl: './account-display.component.html',
  styleUrls: ['./account-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AccountDisplayComponent extends BaseComponent {
  userBasicData$ = this.store.select(selectUserAppAccount).pipe(takeUntil(this.__destroy));

  constructor(
    public auth: FirebaseAuthService,
    private store: Store<AppState>,
  ) {
    super('AccountDisplayComponent');
  }
}
