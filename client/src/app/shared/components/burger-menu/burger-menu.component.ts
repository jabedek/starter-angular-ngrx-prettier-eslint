import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@store/app-state';
import { setBurger } from '@store/layout/layout.actions';
import { selectBurgerOpen } from '@store/layout/layout.selectors';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-burger-menu',
  template: `
    <div class="burger" appAccess (access)="toggle()" (escape)="close()">
      <div class="burger__line" [ngClass]="{ open: (burgerOpen$ | async) === true }"></div>
      <div class="burger__line" [ngClass]="{ open: (burgerOpen$ | async) === true }"></div>
      <div class="burger__line" [ngClass]="{ open: (burgerOpen$ | async) === true }"></div>
    </div>
  `,
  styleUrls: ['./burger-menu.component.scss'],
})
export class BurgerMenuComponent {
  burgerOpen$ = this.store.select(selectBurgerOpen);

  constructor(private store: Store<AppState>) {}

  toggle(): void {
    this.store.dispatch(setBurger({ set: 'toggle' }));
  }

  close(): void {
    this.store.dispatch(setBurger({ set: 'close' }));
  }
}
