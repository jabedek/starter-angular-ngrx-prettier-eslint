import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoodAndGroceriesModuleRoutingModule } from './food-and-groceries-routing.module';
import { PyszneDashboardComponent } from './pyszne-dashboard/pyszne-dashboard.component';
import { SharedModule } from '@shared/shared.module';
import { TableComponent } from './pyszne-dashboard/components/table/table.component';
import { PaginationComponent } from './pyszne-dashboard/components/table/components/pagination/pagination.component';
import { FiltersComponent } from './pyszne-dashboard/components/table/components/filters/filters.component';
import { SortingComponent } from './pyszne-dashboard/components/table/components/sorting/sorting.component';
import { DataViewComponent } from './pyszne-dashboard/components/table/components/data-view/data-view.component';
import { PizzaCalculatorComponent } from './pyszne-dashboard/components/pizza-calculator/pizza-calculator.component';

@NgModule({
  declarations: [
    PyszneDashboardComponent,
    TableComponent,
    PaginationComponent,
    FiltersComponent,
    SortingComponent,
    DataViewComponent,
    PizzaCalculatorComponent,
  ],
  imports: [CommonModule, SharedModule, FoodAndGroceriesModuleRoutingModule],
  exports: [],
})
export class FoodAndGroceriesModule {}
