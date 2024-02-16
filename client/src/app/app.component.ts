import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { handlePyszneData } from '@assets/pyszne/handlePyszneData';
import { FirebaseAuthService } from '@core/firebase/firebase-auth.service';
import { FirebaseUsersService } from '@core/firebase/firebase-users.service';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { UserActivityMonitorService } from '@shared/components/user-activity-monitor/user-activity-monitor.service';
import { Lang } from '@shared/models/enums';
import { AppState } from '@store/app-state';
import { selectAuth } from '@store/auth/auth.selectors';
import { Subject, debounce, debounceTime, map, takeUntil } from 'rxjs';
import { comparePerformance } from './test';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AppComponent implements AfterViewInit, OnDestroy {
  title = 'all-nice-stuff';
  destroy$ = new Subject<void>();
  firebase$ = this.store.select(selectAuth).pipe(
    map((auth) => auth.firebase),
    takeUntil(this.destroy$),
  );

  constructor(
    private auth: FirebaseAuthService,
    private store: Store<AppState>,
    translate: TranslateService,
    private router: Router,
    private activityMonitor: UserActivityMonitorService,
  ) {
    handlePyszneData();
    // this.activityMonitor.scheduleCheckerForUserWentAFK();
    // this.router.events.pipe(takeUntil(this.destroy$)).subscribe(() => {
    //   this.auth.noteUserBrowserActivity('open');
    //   window.addEventListener('beforeunload', async () => await this.auth.noteUserBrowserActivity('close'), { once: true });
    // });

    this.auth.refreshLogin(false);

    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang(Lang.pl);

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use(Lang.pl);
  }

  ngAfterViewInit() {
    this.activityMonitor.initCheckers();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
