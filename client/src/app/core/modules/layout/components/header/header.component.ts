import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@store/app-state';
import { selectBurgerOpen } from '@store/layout/layout.selectors';
import { selectUrlParts } from '@store/router/router.selectors';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  burgerOpen$ = this.store.select(selectBurgerOpen);
  currentUrl$ = this.store.select(selectUrlParts);

  constructor(private store: Store<AppState>) {}
}
