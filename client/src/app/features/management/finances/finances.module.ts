import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinancesRoutingModule } from './finances-routing.module';
import { FinancesComponent } from './finances.component';
import { InterpersonalDebtsComponent } from './components/interpersonal-debts/interpersonal-debts.component';

@NgModule({
  declarations: [FinancesComponent, InterpersonalDebtsComponent],
  imports: [CommonModule, FinancesRoutingModule],
})
export class FinancesModule {}
