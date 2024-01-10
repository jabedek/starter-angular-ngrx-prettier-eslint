import { ChangeDetectionStrategy, Component, Inject, Injectable, OnDestroy, inject } from '@angular/core';
import { LayoutService } from '@core/modules/layout/services/layout.service';
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

  __trackByFn(collectionName: string): TrackFn {
    return (index: number) => `${collectionName}-${index}`;
  }

  ngOnDestroy(): void {
    this.__destroy.next();
    this.__destroy.complete();
  }
}
