import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '@core/modules/auth/auth.service';
import { Store } from '@ngrx/store';
import { BaseComponent } from '@shared/components/base/base.component';
import { AppState } from '@store/app-state';
import { selectUserBasicData, selectUserLoggedIn } from '@store/auth/auth.selectors';
import { EMPTY, filter, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-account-display',
  templateUrl: './account-display.component.html',
  styleUrls: ['./account-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AccountDisplayComponent extends BaseComponent {
  userBasicData$ = this.store.select(selectUserBasicData).pipe(takeUntil(this.__destroy));

  constructor(
    public auth: AuthService,
    private store: Store<AppState>,
  ) {
    super();
  }
}
