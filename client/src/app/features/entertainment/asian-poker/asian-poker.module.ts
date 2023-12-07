import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AsianPokerRoutingModule } from './asian-poker-routing.module';
import { AsianPokerComponent } from './asian-poker.component';
import { CardStyleDirective } from './directives/card-style.directive';
import { PlayerGuiComponent } from './components/player-gui/player-gui.component';
import { PlayingTableComponent } from './components/playing-table/playing-table.component';
import { SharedModule } from '@shared/shared.module';
import { AsianPokerButtonComponent } from './components/asian-poker-button/asian-poker-button.component';
import { RankPipe } from './pipes/rank.pipe';
import { SuitPipe } from './pipes/suit.pipe';

@NgModule({
  declarations: [
    AsianPokerComponent,
    CardStyleDirective,
    PlayerGuiComponent,
    PlayingTableComponent,
    AsianPokerButtonComponent,
    RankPipe,
    SuitPipe,
  ],
  imports: [CommonModule, AsianPokerRoutingModule, SharedModule],
})
export class AsianPokerModule {}
