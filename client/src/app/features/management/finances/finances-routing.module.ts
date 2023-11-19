import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '@core/modules/auth/auth.guard';
import { LayoutComponent } from '@core/modules/layout/layout.component';
import { FinancesComponent } from './finances.component';
import { InterpersonalDebtsComponent } from './components/interpersonal-debts/interpersonal-debts.component';

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
          { path: 'interpersonal-debts', component: InterpersonalDebtsComponent },

          // {
          //   path: '',
          //   pathMatch: 'full',
          //   component: FinancesComponent,
          //   children: [
          //     // { path: 'formal', children: [{ path: 'invoices-manager', component: undefined }] },
          //   ],
          // },
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
