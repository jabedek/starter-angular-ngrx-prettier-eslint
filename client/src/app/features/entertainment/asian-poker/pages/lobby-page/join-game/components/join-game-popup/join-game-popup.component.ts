import { Component, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AsianPokerService } from '@core/firebase/asian-poker.service';
import { PopupService } from '@core/modules/layout/components/popup/popup.service';
import { AsianPokerSession } from '@features/entertainment/asian-poker/asian-poker-lobby.model';
import { consoleError, tryCatch } from '@shared/helpers/common.utils';
import { UserAppAccount } from '@store/auth/auth.state';
/**
 * Variant I: join public game -> pass selected session id. SessionId is set into the input field.
 * Variant II: join private game -> pass nothing. User must enter session id manually.
 *
 * Joining: click join button -> call join() -> get session by id -> check password -> join session.
 */

@Component({
  selector: 'app-join-game-popup',
  templateUrl: './join-game-popup.component.html',
  styleUrls: [
    '../../join-game.component.scss',
    '../../../make-game/make-game.component.scss',
    './join-game-popup.component.scss',
  ],
})
export class JoinGamePopupComponent {
  private session: AsianPokerSession | undefined;
  error = '';

  @Input() userPlayer: UserAppAccount | undefined;

  @Input() set disabled(disabled: boolean) {
    this._disabled = disabled;
    this.joinForm.controls.id.disable();
  }
  get disabled(): boolean {
    return this._disabled;
  }
  private _disabled = false;

  @Input() set sessionId(sessionId: string) {
    console.log(sessionId);

    this._sessionId = sessionId;
    this.joinForm.controls.id.setValue(sessionId);
  }
  get sessionId(): string {
    return this._sessionId;
  }
  private _sessionId = '';

  joinForm = new FormGroup({
    id: new FormControl({ value: '', disabled: this.disabled }),
    password: new FormControl({ value: '', disabled: false }),
  });

  constructor(
    private ap: AsianPokerService,
    private popup: PopupService,
    private router: Router,
  ) {}

  join() {
    const { id, password } = this.joinForm.getRawValue();
    const playerId = this.userPlayer?.id;
    console.log(id, password);

    this.error = '';

    if (id && playerId) {
      this.ap.getSessions([id]).then(async (sessions) => {
        if (sessions.length > 0) {
          this.session = sessions[0];
          const sessionPwd = this.session.password;

          if (sessionPwd) {
            if (password !== sessionPwd) {
              consoleError('Wrong password.');
              this.error += 'Wrong password.';
              return;
            } else {
              console.log('Correct password.');
            }
          }

          if (this.session.playersJoined < this.session.playersLimit) {
            console.log('Can join.');
          } else {
            consoleError(`Too many players (reached limit: ${this.session.playersLimit}).`);
            this.error += `Too many players (reached limit: ${this.session.playersLimit}).`;
            return;
          }

          const [res, err] = await tryCatch(this.ap.addPlayerToSession(playerId, id));
          if (err) {
            consoleError(err);

            this.error += `\n\n${err}.`;

            return;
          } else {
            console.log('Success');
            console.log('res', res);
            this.popup.hidePopup();
            this.router.navigate(['/asian-poker/waiting-room/' + id]);
          }
        }
      });
    }
  }
}

// TODO:

// ## 0. SESSION SETUP ##
// I. Add chatroom and all info in 'setup' view.
//
// II. After session players limit is reached --> session starts automatically, without need to press start button

// ## 1. LEAVING A SESSION ##
// I. Recognize two types of Leaving:
// - Exit: leaving by closing tab/window
// - Quit: leaving by clicking 'leave' button
//
// II. Leaving can occur in two states: setup and playing.
// Setup waits for player for 30 seconds (unless he's a host); playing waits for player for 15 seconds. If player was a host, he gets replaced.
// After that time, player is kicked off the session. That means:  update session.playersJoinedIds and session.playersJoined.
//
// III. If host leaves during 'setup' state:
// - and there is no other players waiting --> session is deleted after 1 minute
// - and there are other players waiting --> host is replaced by one of players if he doesn't join in 30 seconds
