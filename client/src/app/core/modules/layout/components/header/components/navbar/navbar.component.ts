import { Component } from '@angular/core';
import { APP_ROUTES } from './routes.const';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  routes = APP_ROUTES;
}
