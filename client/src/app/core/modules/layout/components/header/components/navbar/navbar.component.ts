import { Component, ElementRef, HostBinding, HostListener } from '@angular/core';
import { APP_ROUTES } from './routes.const';
import { Observable, first, fromEvent, skipUntil, takeUntil, takeWhile, tap } from 'rxjs';
import { BaseComponent } from '@shared/components/base/base.component';
import { Store } from '@ngrx/store';
import { AppState } from '@store/app-state';
import { setBurger } from '@store/layout/layout.actions';
import { selectBurgerOpen } from '@store/layout/layout.selectors';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  routes = APP_ROUTES;

  // @HostListener('document:click', ['$event'])
  // clickout(event: Event) {
  //   if (this.el.nativeElement.contains(event.target)) {
  //   } else {
  //     this.store
  //       .select(selectBurgerOpen)
  //       .pipe(first())
  //       .subscribe((open) => {
  //         if (open) {
  //           this.store.dispatch(setBurger({ set: 'close' }));
  //         }
  //       });
  //   }
  // }

  constructor(
    public el: ElementRef,
    private store: Store<AppState>,
  ) {}
}
