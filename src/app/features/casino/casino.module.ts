import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CasinoRoutingModule } from './casino-routing.module';
import { CasinoComponent } from './casino.component';

@NgModule({
  declarations: [CasinoComponent],
  imports: [CommonModule, CasinoRoutingModule],
})
export class CasinoModule {}
