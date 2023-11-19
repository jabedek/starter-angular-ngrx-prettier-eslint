import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '@core/modules/auth/auth.guard';
import { LayoutComponent } from '@core/modules/layout/layout.component';
import { PersonalsComponent } from './personals.component';

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
          { path: '', pathMatch: 'full', component: PersonalsComponent },
          { path: 'birthdays', component: PersonalsComponent },
          { path: 'events', component: PersonalsComponent },
          { path: 'fundraising', component: PersonalsComponent },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersonalsRoutingModule {}
