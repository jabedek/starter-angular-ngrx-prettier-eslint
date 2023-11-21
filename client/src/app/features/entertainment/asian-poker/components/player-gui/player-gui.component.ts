import { Component, Input } from '@angular/core';
import { AsianPokerPlayerInfo, AsianPokerSession } from '../../asian-poker.model';

@Component({
  selector: 'app-player-gui',
  templateUrl: './player-gui.component.html',
  styleUrls: ['./player-gui.component.scss'],
})
export class PlayerGuiComponent {
  @Input({ required: true }) session: AsianPokerSession | undefined;
  @Input({ required: true }) currentUser: Partial<AsianPokerPlayerInfo> | undefined;

  get players() {
    return this.session?.turnPlayers || [];
  }

  get currentPlayerIndex() {
    return this.session?.currentPlayerIndex === undefined ? -1 : this.session?.currentPlayerIndex;
  }

  get currentDealerIndex() {
    return this.session?.currentDealerIndex === undefined ? -1 : this.session?.currentDealerIndex;
  }

  get showGeneralGUI() {
    return !!this.session;
  }

  get showPlayerGUI() {
    return this.players[this.currentPlayerIndex]?.id === this.currentUser?.id;
  }
  constructor() {
    console.log(this.session);
  }
}
