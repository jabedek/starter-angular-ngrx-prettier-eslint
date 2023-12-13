import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

const trackBy = (_: number): string => ``;
type TrackFn = typeof trackBy;

@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.Default,
})
export abstract class BaseComponent implements OnDestroy {
  readonly __destroy = new Subject<void>();

  __trackByFn(collectionName: string): TrackFn {
    return (index: number) => `${collectionName}-${index}`;
  }

  ngOnDestroy(): void {
    this.__destroy.next();
    this.__destroy.complete();
  }
}
