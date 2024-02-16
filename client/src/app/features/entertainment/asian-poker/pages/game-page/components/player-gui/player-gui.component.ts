import { Component, Input, OnInit } from '@angular/core';
import { PlayerWithHand } from '../../../../models/game.model';
import { AsianPokerGameDTO } from '@features/entertainment/asian-poker/models/dto';
import { SessionGameDataPair } from '@features/entertainment/asian-poker/models/common.model';

@Component({
  selector: 'app-player-gui',
  templateUrl: './player-gui.component.html',
  styleUrls: ['./player-gui.component.scss'],
})
export class PlayerGuiComponent {
  @Input({ required: true }) currentUser: Partial<PlayerWithHand> | undefined;
  @Input({ required: true }) data: SessionGameDataPair | undefined;
  get gameLastTick() {
    return this.data?.game?.ticks.at(-1);
  }

  get currentPlayerIndex() {
    return this.gameLastTick?.currentPlayerIndex || 0;
  }

  get currentDealerIndex() {
    return this.gameLastTick?.currentDealerIndex || 0;
  }

  get currentPlayer() {
    if (this.gameLastTick) {
      return this.gameLastTick.playersWithHands[this.currentPlayerIndex];
    }
    return undefined;
  }

  get currentDealer() {
    if (this.gameLastTick) {
      return this.gameLastTick.playersWithHands[this.currentDealerIndex];
    }
    return undefined;
  }

  get isCurrentUserMoving() {
    return this.currentPlayer?.displayName === this.currentUser?.displayName || false;
  }

  get publicCards() {
    return this.gameLastTick?.publicCards || [];
  }

  get turnPlayers() {
    return this.gameLastTick?.playersWithHands || [];
  }
  startTurn() {
    // this.croupier.startTurn(this.sessionId);
  }

  call() {
    // if (this.session && this.currentPlayer) {
    // this.croupier.play(this.sessionId, {
    //   type: PlayerActions.PLAY_CALL,
    //   data: {
    //     playerId: this.currentPlayer?.id || '',
    //     playerIndex: this.session?.currentPlayerIndex,
    //     cycleId: this.session?.turnCycleCounter,
    //     roundId: this.session?.turnCycleCounter,
    //     calledCardSet: undefined,
    //   },
    // });
    // }
  }

  check() {
    // if (this.session && this.currentPlayer) {
    // this.croupier.play(this.sessionId, {
    //   type: PlayerActions.PLAY_CHECK,
    //   data: {
    //     playerId: this.currentPlayer?.id || '',
    //     playerIndex: this.session?.currentPlayerIndex,
    //     cycleId: this.session?.turnCycleCounter,
    //     roundId: this.session?.turnCycleCounter,
    //   },
    // });
    // }
  }
}
