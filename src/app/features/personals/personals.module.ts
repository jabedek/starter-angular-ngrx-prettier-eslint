import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonalsRoutingModule } from './personals-routing.module';
import { PersonalsComponent } from './personals.component';


@NgModule({
  declarations: [
    PersonalsComponent
  ],
  imports: [
    CommonModule,
    PersonalsRoutingModule
  ]
})
export class PersonalsModule { }
