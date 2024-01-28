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
import { WaitingRoomPageComponent } from './pages/waiting-room-page/waiting-room-page.component';
import { BasicCardComponent } from './components/basic-card/basic-card.component';
import { BasicShelfComponent } from './components/basic-shelf/basic-shelf.component';
import { GamesListComponent } from './pages/lobby-page/games-list/games-list.component';
import { JoinGamePopupComponent } from './pages/lobby-page/games-list/components/join-game-popup/join-game-popup.component';
import { CreateSessionComponent } from './pages/lobby-page/create-session/create-session.component';
@NgModule({
  declarations: [
    GamePageComponent,
    LobbyPageComponent,
    WaitingRoomPageComponent,

    AsianPokerComponent,
    PlayerGuiComponent,
    PlayingTableComponent,
    HandPickerComponent,
    CreateSessionComponent,
    GamesListComponent,
    JoinGamePopupComponent,

    AsianPokerButtonComponent,
    BasicCardComponent,
    BasicShelfComponent,

    CardStyleDirective,
    CardPipe,
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
