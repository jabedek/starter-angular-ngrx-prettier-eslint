import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SomeFastGameRoutingModule } from './some-fast-game-routing.module';
import { SomeFastGameComponent } from './some-fast-game.component';

@NgModule({
  declarations: [SomeFastGameComponent],
  imports: [CommonModule, SomeFastGameRoutingModule],
})
export class SomeFastGameModule {}
