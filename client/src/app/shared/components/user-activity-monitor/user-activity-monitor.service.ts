import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseAuthService } from '@core/firebase/firebase-auth.service';
import { BaseComponent } from '@shared/abstracts/base/base.component';
import { addMinutes } from 'date-fns';
import { BehaviorSubject, filter, takeUntil } from 'rxjs';

export const UserActionEvents = [
  'click',
  'mousedown',
  'mousemove',
  'touchmove',
  'mousewheel',
  'wheel',
  'contextmenu',
  'keydown',
  'scroll',
  'reset',
] as const;
export type UserActionEventName = (typeof UserActionEvents)[number];
export type UserActionEventData = { eventName: UserActionEventName; event: Event; timestamp: number };
export type RecordedUserAction = { userAction: boolean; eventData: UserActionEventData | undefined };

export const MonitorWaiting = {
  minutesInt: 2.5,
  secondsInt: 150,
  milisecondsInt: 1000 * 60 * 2.5,
};

export const MonitorTracking = {
  minutesInt: 0.5,
  secondsInt: 30,
  milisecondsInt: 1000 * 60 * 0.5,
};

export type Duration = {
  start: number;
  end: number;
};

@Injectable({
  providedIn: 'root',
})
export class UserActivityMonitorService extends BaseComponent implements OnDestroy {
  private alreadyInited = false;
  private intervalId: NodeJS.Timeout | undefined;

  waitingDuration$ = new BehaviorSubject<Duration>({ start: 0, end: 0 });
  trackingDuration$ = new BehaviorSubject<Duration>({ start: 0, end: 0 });

  presenceInCurrentInterval$ = new BehaviorSubject<RecordedUserAction>({ userAction: false, eventData: undefined });
  activePresenceInCurrentInterval$ = this.presenceInCurrentInterval$.pipe(
    filter(({ userAction, eventData }) => !!(userAction && eventData)),
  );

  constructor(
    private router: Router,
    private auth: FirebaseAuthService,
  ) {
    super('UserActivityMonitorService');
  }

  override ngOnDestroy(): void {
    clearInterval(this.intervalId);
    this.alreadyInited = false;
  }

  initCheckers() {
    if (!this.alreadyInited) {
      this.alreadyInited = true;

      this.scheduleListeningToAppActive();
      this.scheduleIntervalListeningToUserActive();
    }
  }

  private scheduleListeningToAppActive() {
    this.router.events.pipe(takeUntil(this.__destroy)).subscribe(() => {
      this.auth.noteUserBrowserActivity('open');
      window.addEventListener('beforeunload', async () => await this.auth.noteUserBrowserActivity('close'), { once: true });
    });
  }

  private scheduleIntervalListeningToUserActive() {
    this.listenUserActivity();
    this.intervalId = setInterval(() => this.listenUserActivity(), MonitorWaiting.milisecondsInt);
    console.log(this.intervalId);
  }

  private listenUserActivity() {
    console.log('listenUserActivity');

    this.presenceInCurrentInterval$.next({
      userAction: false,
      eventData: undefined,
    });

    const start = new Date().getTime();
    const end = addMinutes(start, MonitorWaiting.minutesInt).getTime();
    this.waitingDuration$.next({ start, end });

    const timeout = setTimeout(() => this.removeUserActivityListeners(), MonitorTracking.milisecondsInt);
    this.addUserActivityListeners(timeout);
  }

  private handleUserActivityEvents(eventName: UserActionEventName, event: Event, timeout: NodeJS.Timeout | undefined) {
    this.presenceInCurrentInterval$.next({
      userAction: true,
      eventData: {
        event,
        eventName,
        timestamp: Date.now(),
      },
    });
    if (timeout) {
      clearTimeout(timeout);
      this.removeUserActivityListeners();
    }
  }

  private addUserActivityListeners(timeout: NodeJS.Timeout) {
    const start = new Date().getTime();
    const end = addMinutes(start, MonitorTracking.minutesInt).getTime();
    this.trackingDuration$.next({ start, end });

    UserActionEvents.forEach((eventName: UserActionEventName) =>
      window.addEventListener(eventName, (event) => this.handleUserActivityEvents(eventName, event, timeout), { once: true }),
    );
  }

  private removeUserActivityListeners() {
    const timeout: NodeJS.Timeout | undefined = undefined;

    UserActionEvents.forEach((eventName: UserActionEventName) =>
      window.removeEventListener(eventName, (event) => this.handleUserActivityEvents(eventName, event, timeout)),
    );
  }
}
