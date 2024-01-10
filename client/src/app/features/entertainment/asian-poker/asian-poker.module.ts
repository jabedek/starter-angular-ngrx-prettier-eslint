import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AsianPokerRoutingModule } from './asian-poker-routing.module';
import { AsianPokerComponent } from './asian-poker.component';
import { CardStyleDirective } from './directives/card-style.directive';
import { PlayerGuiComponent } from './pages/game-page/components/player-gui/player-gui.component';
import { PlayingTableComponent } from './pages/game-page/components/playing-table/playing-table.component';
import { SharedModule } from '@shared/shared.module';
import { AsianPokerButtonComponent } from './components/asian-poker-button/asian-poker-button.component';
import { HandPickerComponent } from './pages/game-page/components/hand-picker/hand-picker.component';
import { CardPipe } from './pipes/card.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { GamePageComponent } from './pages/game-page/game-page.component';
import { LobbyPageComponent } from './pages/lobby-page/lobby-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MakeGameComponent } from './pages/lobby-page/make-game/make-game.component';
import { JoinGameComponent } from './pages/lobby-page/join-game/join-game.component';
import { SetupPageComponent } from './pages/setup-page/setup-page.component';

@NgModule({
  declarations: [
    AsianPokerComponent,
    CardStyleDirective,
    PlayerGuiComponent,
    PlayingTableComponent,
    AsianPokerButtonComponent,
    HandPickerComponent,
    CardPipe,
    GamePageComponent,
    LobbyPageComponent,
    MakeGameComponent,
    JoinGameComponent,
    SetupPageComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule.forChild({
      extend: true,
    }),
    AsianPokerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
})
export class AsianPokerModule {}
