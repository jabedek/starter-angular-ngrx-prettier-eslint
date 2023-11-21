import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AsianPokerRoutingModule } from './asian-poker-routing.module';
import { AsianPokerComponent } from './asian-poker.component';
import { CardStyleDirective } from './directives/card-style.directive';
import { PlayerGuiComponent } from './components/player-gui/player-gui.component';
import { PlayingTableComponent } from './components/playing-table/playing-table.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [AsianPokerComponent, CardStyleDirective, PlayerGuiComponent, PlayingTableComponent],
  imports: [CommonModule, AsianPokerRoutingModule, SharedModule],
})
export class AsianPokerModule {}
