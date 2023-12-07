import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, createComponent } from '@angular/core';
import { AuthService } from '@core/modules/auth/auth.service';
import { Store } from '@ngrx/store';
import { BaseComponent } from '@shared/components/base/base.component';
import { PopupGlobalComponent } from '@shared/components/popup-global/popup-global.component';
import { AppState } from '@store/app-state';
import { selectAuth } from '@store/auth/auth.selectors';
import { map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AppComponent extends BaseComponent implements AfterViewInit {
  @ViewChild(PopupGlobalComponent)
  set popup(val: PopupGlobalComponent) {
    setTimeout(() => {
      console.log(val);

      // val.manage({ isShown: true }).subscribe((d) => console.log(d));
    }, 0);
  }

  title = 'all-nice-stuff';
  firebase$ = this.store.select(selectAuth).pipe(map((auth) => auth.firebase));

  constructor(
    private auth: AuthService,
    private store: Store<AppState>,
  ) {
    super();
  }

  ngAfterViewInit(): void {
    console.log(this.popup);
  }

  async logout() {
    this.auth.logout();
  }

  async refreshLogin() {
    this.auth.refreshLogin();
  }
}
