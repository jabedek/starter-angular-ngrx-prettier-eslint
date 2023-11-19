import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@store/app-state';
import { selectBurgerOpen } from '@store/layout/layout.selectors';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  burgerOpen$ = this.store.select(selectBurgerOpen);

  constructor(private store: Store<AppState>) {}
}
