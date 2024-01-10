import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, createComponent } from '@angular/core';
import { FirebaseUsersService } from '@core/firebase/firebase-users.service';
import { AuthService } from '@core/modules/auth/auth.service';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from '@shared/components/base/base.component';
import { PopupGlobalComponent } from '@shared/components/popup-global/popup-global.component';
import { Lang } from '@shared/models/enums';
import { AppState } from '@store/app-state';
import { selectAuth } from '@store/auth/auth.selectors';
import { UserAppAccount } from '@store/auth/auth.state';
import { Unsubscribe } from 'firebase/firestore';
import { map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AppComponent extends BaseComponent {
  title = 'all-nice-stuff';
  firebase$ = this.store.select(selectAuth).pipe(map((auth) => auth.firebase));

  constructor(
    private auth: AuthService,
    private store: Store<AppState>,
    translate: TranslateService,
    private fbUsers: FirebaseUsersService,
  ) {
    super('AppComponent');
    this.auth.refreshLogin(false);

    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang(Lang.pl);

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use(Lang.pl);

    this.fbUsers.loggedUsers$.subscribe((users: UserAppAccount[]) => {});
  }
}
