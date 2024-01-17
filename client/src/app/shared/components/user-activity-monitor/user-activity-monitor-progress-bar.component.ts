import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

import { ProgressBarComponent } from '@shared/components/progress-bar/progress-bar.component';
import { interval, map, of, switchMap, take, takeUntil, tap, timer } from 'rxjs';
import { MonitorWaiting, MonitorTracking, UserActivityMonitorService } from './user-activity-monitor.service';

@Component({
  selector: 'app-user-activity-monitor-progress-bar',
  templateUrl: './user-activity-monitor-progress-bar.component.html',
  styleUrls: ['./user-activity-monitor-progress-bar.component.scss'],
})
export class UserActivityMonitorProgressBarComponent {
  @ViewChild('progressLength', { read: ProgressBarComponent }) set progressLength(progressLength: ProgressBarComponent) {
    console.log(progressLength);
    this._progressLength = progressLength;
  }

  get progressLength(): ProgressBarComponent | undefined {
    return this._progressLength;
  }
  private _progressLength: ProgressBarComponent | undefined;

  checkingIntervalTicks = this.activityMonitor.waitingDuration$.pipe(
    switchMap(() => interval(1000).pipe(take(MonitorWaiting.secondsInt))),
    map((i) => ({ start: i + 1, end: MonitorWaiting.secondsInt })),
  );

  checkingLengthTicks = this.activityMonitor.trackingDuration$.pipe(
    switchMap(() =>
      interval(1000).pipe(
        take(MonitorTracking.secondsInt),
        takeUntil(
          this.activityMonitor.activePresenceInCurrentInterval$.pipe(
            tap(() => this.progressLength?.setValue(MonitorTracking.secondsInt)),
          ),
        ),
      ),
    ),
    map((i) => ({ start: i + 1, end: MonitorTracking.secondsInt })),
  );

  constructor(public activityMonitor: UserActivityMonitorService) {}
}
