import { Component, Input, OnInit } from '@angular/core';
import { PlayerWithHand } from '../../../../models/game.model';
import { AsianPokerGameDTO } from '@features/entertainment/asian-poker/models/dto';

@Component({
  selector: 'app-player-gui',
  templateUrl: './player-gui.component.html',
  styleUrls: ['./player-gui.component.scss'],
})
export class PlayerGuiComponent {
  @Input({ required: true }) currentUser: Partial<PlayerWithHand> | undefined;
  session: AsianPokerGameDTO | undefined;
  @Input({ required: true }) set sessionId(id: string) {
    this._sessionId = id;
    // this.session = this.croupier.getSession(id);
  }
  get sessionId() {
    return this._sessionId;
  }
  private _sessionId = '';

  // get currentPlayer() {
  //   // if (this.session) {
  //   //   return this.session.turnPlayers[this.session.currentPlayerIndex];
  //   // }
  //   // return undefined;
  // }

  // get currentDealer() {
  //   // if (this.session) {
  //   //   return this.session.turnPlayers[this.session.currentDealerIndex];
  //   // }
  //   // return undefined;
  // }

  // get isCurrentUserMoving() {
  //   // return this.session?.turnPlayers[this.session.currentPlayerIndex]?.nickname === this.currentUser?.nickname || false;
  // }

  // get isCurrentUserDealer() {
  //   // return this.session?.turnPlayers[this.session.currentDealerIndex]?.nickname === this.currentUser?.nickname || false;
  // }

  // startTurn() {
  //   // this.croupier.startTurn(this.sessionId);
  // }

  // call() {
  //   if (this.session && this.currentPlayer) {
  //     // this.croupier.play(this.sessionId, {
  //     //   type: PlayerActions.PLAY_CALL,
  //     //   data: {
  //     //     playerId: this.currentPlayer?.id || '',
  //     //     playerIndex: this.session?.currentPlayerIndex,
  //     //     cycleId: this.session?.turnCycleCounter,
  //     //     roundId: this.session?.turnCycleCounter,
  //     //     calledCardSet: undefined,
  //     //   },
  //     // });
  //   }
  // }

  // check() {
  //   if (this.session && this.currentPlayer) {
  //     // this.croupier.play(this.sessionId, {
  //     //   type: PlayerActions.PLAY_CHECK,
  //     //   data: {
  //     //     playerId: this.currentPlayer?.id || '',
  //     //     playerIndex: this.session?.currentPlayerIndex,
  //     //     cycleId: this.session?.turnCycleCounter,
  //     //     roundId: this.session?.turnCycleCounter,
  //     //   },
  //     // });
  //   }
  // }
}
