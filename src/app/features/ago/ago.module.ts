import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgoRoutingModule } from './ago-routing.module';
import { AgoComponent } from './ago.component';


@NgModule({
  declarations: [
    AgoComponent
  ],
  imports: [
    CommonModule,
    AgoRoutingModule
  ]
})
export class AgoModule { }
