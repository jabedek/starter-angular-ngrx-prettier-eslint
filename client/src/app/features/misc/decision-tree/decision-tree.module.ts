import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DecisionTreeRoutingModule } from './decision-tree-routing.module';
import { DecisionTreeComponent } from './decision-tree.component';


@NgModule({
  declarations: [
    DecisionTreeComponent
  ],
  imports: [
    CommonModule,
    DecisionTreeRoutingModule
  ]
})
export class DecisionTreeModule { }
