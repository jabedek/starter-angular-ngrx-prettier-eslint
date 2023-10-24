import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaintchatComponent } from './paintchat.component';
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
        children: [{ path: '', pathMatch: 'full', component: PaintchatComponent }],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaintchatRoutingModule {}
