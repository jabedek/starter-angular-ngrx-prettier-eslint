import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '@core/modules/layout/layout.component';

const routes: Routes = [
  {
    path: '',
    title: 'Food and Groceries',
    children: [
      {
        path: '',
        component: LayoutComponent,
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'pyszne' },
          // { path: 'pyszne', component: PyszneComponent },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FoodAndGroceriesModuleRoutingModule {}
