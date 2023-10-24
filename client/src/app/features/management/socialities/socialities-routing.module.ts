import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SocialitiesComponent } from './socialities.component';
import { authGuard } from '@core/modules/auth/auth.guard';
import { LayoutComponent } from '@core/modules/layout/layout.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: LayoutComponent,
        canActivateChild: [authGuard],
        children: [
          { path: '', pathMatch: 'full', component: SocialitiesComponent },

          // { path: 'birthdays', component: undefined },
          // { path: 'events', component: undefined },
          // { path: 'fundraisers', component: undefined },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SocialitiesRoutingModule {}
