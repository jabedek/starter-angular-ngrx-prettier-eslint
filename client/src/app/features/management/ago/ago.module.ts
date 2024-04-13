import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgoRoutingModule } from './ago-routing.module';
import { AgoComponent } from './ago.component';
import { AgoPosPipe } from './pipes/ago-pos.pipe';
import { AgoCalendarComponent } from './components/ago-calendar/ago-calendar.component';

@NgModule({
  declarations: [AgoComponent, AgoPosPipe, AgoCalendarComponent],
  imports: [CommonModule, AgoRoutingModule],
})
export class AgoModule {}
