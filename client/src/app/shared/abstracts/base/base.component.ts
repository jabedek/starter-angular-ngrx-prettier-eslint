import { ChangeDetectionStrategy, Component, Inject, Injectable, OnDestroy, inject } from '@angular/core';
import { LayoutService } from '@core/modules/layout/services/layout.service';
import { Unsubscribe } from 'firebase/firestore';
import { Subject } from 'rxjs';

const trackBy = (_: number): string => ``;
type TrackFn = typeof trackBy;

// @Component({
//   template: '',
//   changeDetection: ChangeDetectionStrategy.Default,
// })
@Injectable()
export abstract class BaseComponent implements OnDestroy {
  public __layoutService = inject(LayoutService);
  private __firebaseUnsubs = new Map<string, Unsubscribe>();
  private __timers = new Map<string, NodeJS.Timeout>();

  private set __className(__className: string) {
    this.___className = __className;
    this.__classNameOnSet();
  }
  get __className(): string {
    return this.___className;
  }
  private ___className = 'BaseComponent';
  private __classNameOnSet(args?: any) {
    return;
  }

  readonly __destroy = new Subject<void>();

  constructor(@Inject(String) name: string) {
    this.__className = name || 'BaseComponent';
  }

  ngOnDestroy(): void {
    console.log('# ngOnDestroy', this.___className);

    this.__deleteFirebaseListeners();
    this.__deleteTimers();
    this.__destroy.next();
    this.__destroy.complete();
  }

  __getTrackByFn(collectionName: string): TrackFn {
    return (index: number | string) => `${collectionName}-${index}`;
  }

  public __registerTimer(name: string, timer: NodeJS.Timeout) {
    const alreadyExists = this.__timers.get(name);
    if (alreadyExists) {
      clearTimeout(alreadyExists);
      clearInterval(alreadyExists);
    }
    this.__timers.set(name, timer);
  }

  public __addFirebaseListener(name: string, unsub: Unsubscribe) {
    this.__firebaseUnsubs.set(name, unsub);
  }

  public __deleteFirebaseListeners() {
    this.__firebaseUnsubs.forEach((unsub, key) => {
      if (unsub) {
        unsub();
      }
      this.__firebaseUnsubs.delete(key);
    });
  }

  public __deleteTimers() {
    this.__timers.forEach((timer, key) => {
      if (timer) {
        clearTimeout(timer);
        clearInterval(timer);
      }
      this.__timers.delete(key);
    });
  }
}
