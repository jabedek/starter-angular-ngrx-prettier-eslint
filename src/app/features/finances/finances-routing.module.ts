import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '@core/modules/auth/auth.guard';
import { LayoutComponent } from '@core/modules/layout/layout.component';
import { FinancesComponent } from './finances.component';

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
          {
            path: '',
            pathMatch: 'full',
            component: FinancesComponent,
            children: [
              // { path: 'informal', children: [{ path: 'interpersonal-debts', component: undefined }] },
              // { path: 'formal', children: [{ path: 'invoices-manager', component: undefined }] },
            ],
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinancesRoutingModule {}
