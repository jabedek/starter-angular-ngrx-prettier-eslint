import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';

import { ProgressBarComponent } from '@shared/components/progress-bar/progress-bar.component';
import { debounceTime, interval, map, of, skip, switchMap, take, takeUntil, tap, timer } from 'rxjs';
import { MonitorWaiting, MonitorTracking, UserActivityMonitorService } from './user-activity-monitor.service';

@Component({
  selector: 'app-user-activity-monitor-progress-bar',
  templateUrl: './user-activity-monitor-progress-bar.component.html',
  styleUrls: ['./user-activity-monitor-progress-bar.component.scss'],
})
export class UserActivityMonitorProgressBarComponent {
  @Input() hidden = false;
  @ViewChild('progressLength', { read: ProgressBarComponent }) set progressLength(progressLength: ProgressBarComponent) {
    this._progressLength = progressLength;
  }

  get progressLength(): ProgressBarComponent | undefined {
    return this._progressLength;
  }
  private _progressLength: ProgressBarComponent | undefined;

  checkingIntervalTicks = this.activityMonitor.waitingDuration$.pipe(
    switchMap(() =>
      interval(1000).pipe(
        take(MonitorWaiting.secondsInt),
        tap(() => this.cdr.detectChanges()),
      ),
    ),
    map((i) => ({ start: i + 1, end: MonitorWaiting.secondsInt })),
  );

  checkingLengthTicks = this.activityMonitor.trackingDuration$.pipe(
    switchMap(() =>
      interval(1000).pipe(
        take(MonitorTracking.secondsInt),
        tap(() => this.cdr.detectChanges()),
        takeUntil(
          this.activityMonitor.activePresenceInCurrentInterval$.pipe(
            debounceTime(3000),
            tap(() => this.progressLength?.setValue(MonitorTracking.secondsInt)),
          ),
        ),
      ),
    ),
    map((i) => ({ start: i + 1, end: MonitorTracking.secondsInt })),
  );

  constructor(
    public activityMonitor: UserActivityMonitorService,
    private cdr: ChangeDetectorRef,
  ) {}
}
