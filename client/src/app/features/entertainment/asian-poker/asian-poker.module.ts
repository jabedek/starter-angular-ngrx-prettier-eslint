import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AsianPokerRoutingModule } from './asian-poker-routing.module';
import { AsianPokerComponent } from './asian-poker.component';


@NgModule({
  declarations: [
    AsianPokerComponent
  ],
  imports: [
    CommonModule,
    AsianPokerRoutingModule
  ]
})
export class AsianPokerModule { }
