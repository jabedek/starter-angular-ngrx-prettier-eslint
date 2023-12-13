import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';
import { AccountComponent } from './account.component';
import { authGuard } from '../auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard()],
    children: [
      {
        path: '',
        component: LayoutComponent,
        canActivateChild: [authGuard()],
        children: [{ path: '', pathMatch: 'full', component: AccountComponent }],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {}
