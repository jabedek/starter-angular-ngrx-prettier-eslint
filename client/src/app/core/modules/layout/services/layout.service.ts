import { Injectable, Input, OnDestroy } from '@angular/core';
import { EventType, NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '@store/app-state';
import { setBurger } from '@store/layout/layout.actions';
import { BehaviorSubject, Subject, map, takeUntil } from 'rxjs';

// export enum DataLoaders {
//   auth = 'auth',
// }

export type DataLoaders = 'auth';
export type LoaderState = 'active' | 'inactive';
@Injectable({
  providedIn: 'root',
})
export class LayoutService implements OnDestroy {
  private destroy$ = new Subject<void>();
  private loaders$ = new BehaviorSubject<Record<DataLoaders, LoaderState>>({ auth: 'inactive' });

  constructor(
    private router: Router,
    private store: Store<AppState>,
  ) {
    console.log(this.router);

    this.router.events.pipe(takeUntil(this.destroy$)).subscribe((event) => {
      if (event.type === EventType.NavigationEnd) {
        this.store.dispatch(setBurger({ set: 'close' }));
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setLoader(which: DataLoaders, value: LoaderState) {
    const current = this.loaders$.getValue();
    current[which] = value;
    this.loaders$.next(current);
  }

  getLoader(which: 'auth') {
    return this.loaders$.asObservable().pipe(map((loaders) => loaders[which]));
  }
}
