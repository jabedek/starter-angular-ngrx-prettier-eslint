import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';
import { AccountComponent } from './account.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [],
    children: [
      {
        path: '',
        component: LayoutComponent,
        canActivateChild: [],
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
