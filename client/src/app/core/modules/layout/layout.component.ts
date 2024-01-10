import { Component } from '@angular/core';
import { MousewheelDirective } from '@shared/directives/mousewheel.directive';

@Component({
  selector: 'app-layout',
  template: `
    <app-header></app-header>
    <app-sidebar></app-sidebar>
    <div class="wrapper">
      <app-popup></app-popup>
      <router-outlet></router-outlet>
      <app-footer></app-footer>
    </div>
  `,
  styleUrls: ['./layout.component.scss'],
  // hostDirectives: [MousewheelDirective],
})
export class LayoutComponent {}
