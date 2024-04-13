import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsianPokerRoutingModule } from './asian-poker-routing.module';
import { CardStyleDirective } from './directives/card-style.directive';
import { PlayerGuiComponent } from './pages/game-page/components/player-gui/player-gui.component';
import { PlayingTableComponent } from './pages/game-page/components/playing-table/playing-table.component';
import { SharedModule } from '@shared/shared.module';
import { AsianPokerButtonComponent } from './components/asian-poker-button/asian-poker-button.component';
import { HandPickerComponent } from './pages/game-page/components/hand-picker/hand-picker.component';
import { CardPipe } from './pipes/card.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { GamePageComponent } from './pages/game-page/game-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WaitingRoomPageComponent } from './pages/waiting-room-page/waiting-room-page.component';
import { BasicCardComponent } from './components/basic-card/basic-card.component';
import { BasicShelfComponent } from './components/basic-shelf/basic-shelf.component';
import { InvitePlayerPopupComponent } from './pages/waiting-room-page/components/invite-player-popup/invite-player-popup.component';
import { CreateSessionComponent } from './pages/main-lobby-page/components/create-session/create-session.component';
import { JoinGamePopupComponent } from './pages/main-lobby-page/components/join-game-popup/join-game-popup.component';
import { GamesListComponent } from './pages/main-lobby-page/components/games-list/games-list.component';
import { MainLobbyPageComponent } from './pages/main-lobby-page/main-lobby-page.component';
@NgModule({
  declarations: [
    MainLobbyPageComponent,
    GamePageComponent,
    WaitingRoomPageComponent,

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
    InvitePlayerPopupComponent,
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
