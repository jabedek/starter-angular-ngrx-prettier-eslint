import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CbbgRoutingModule } from './cbbg-routing.module';
import { CbbgComponent } from './cbbg.component';


@NgModule({
  declarations: [
    CbbgComponent
  ],
  imports: [
    CommonModule,
    CbbgRoutingModule
  ]
})
export class CbbgModule { }
