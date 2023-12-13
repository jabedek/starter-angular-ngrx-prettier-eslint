import { Injectable, Input } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private loaders$ = new BehaviorSubject<Record<'auth', boolean>>({ auth: false });

  setLoader(which: 'auth', value: boolean) {
    const current = this.loaders$.getValue();
    current[which] = value;
    console.log(current);

    this.loaders$.next(current);
  }

  getLoader() {
    return this.loaders$.asObservable();
  }
}
