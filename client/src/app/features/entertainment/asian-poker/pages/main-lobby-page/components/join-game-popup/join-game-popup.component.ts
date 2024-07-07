import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AsianPokerService } from '@features/entertainment/asian-poker/firebase/asian-poker.service';
import { PopupService } from '@core/modules/layout/components/popup/popup.service';
import { consoleError, tryCatch } from '@shared/helpers/common.utils';
import { UserAppAccount } from '@store/auth/auth.state';
import { AsianPokerSessionDTO } from '@features/entertainment/asian-poker/models/types/session-game-chat/session.model';
import { AsianPokerSessionService } from '@features/entertainment/asian-poker/firebase/asian-poker-session.service';
/**
 * Variant I: join public game -> pass selected session id. SessionId is set into the input field.
 * Variant II: join private game -> pass nothing. User must enter session id manually.
 *
 * Joining: click join button -> call join() -> get session by id -> check password -> join session.
 */

@Component({
  selector: 'app-join-game-popup',
  templateUrl: './join-game-popup.component.html',
  styleUrls: ['./join-game-popup.component.scss'],
})
export class JoinGamePopupComponent implements OnInit {
  private session: AsianPokerSessionDTO | undefined;
  error = '';
  header = '';

  @Input() set popupMode(popupMode: 'public' | 'private' | 'invite' | undefined) {
    this._popupMode = popupMode || 'public';

    const header =
      this._popupMode === 'invite'
        ? 'Dołączanie z zaproszenia'
        : this._popupMode === 'public'
        ? 'Dołącz do wybranej sesji'
        : 'Podaj id aby odszukać sesję i spróbować do niej dołączyć';

    this.header = header;
  }
  get popupMode(): 'public' | 'private' | 'invite' {
    return this._popupMode;
  }
  private _popupMode: 'public' | 'private' | 'invite' = 'public';

  @Input() userPlayer: UserAppAccount | undefined;

  @Input() set disabled(disabled: boolean) {
    this._disabled = disabled;
    if (disabled) {
      this.joinForm.controls.id.disable();
    } else {
      this.joinForm.controls.id.enable();
    }
  }
  get disabled(): boolean {
    return this._disabled;
  }
  private _disabled = false;

  @Input() set sessionId(sessionId: string) {
    this._sessionId = sessionId;
    this.joinForm.controls.id.setValue(sessionId);

    if (!sessionId) {
      this.joinForm.controls.id.enable();
    }
  }
  get sessionId(): string {
    return this._sessionId;
  }
  private _sessionId = '';

  joinForm = new FormGroup({
    id: new FormControl({ value: '', disabled: this.disabled }),
    password: new FormControl({ value: '', disabled: false }),
  });

  get pwd() {
    return this.session?.accessibility.password;
  }

  constructor(
    private ap: AsianPokerService,
    private apSession: AsianPokerSessionService,
    private popup: PopupService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (this.pwd && this.popupMode === 'invite') {
      this.joinForm.get('password')?.patchValue(this.pwd);
    }
  }

  join() {
    const { id, password } = this.joinForm.getRawValue();
    const playerId = this.userPlayer?.id;

    this.error = '';

    if (id && playerId) {
      this.ap.getSessionsByIds([id]).then(async (sessions) => {
        if (sessions.length > 0) {
          this.session = sessions[0];

          if (this.session) {
            const sessionPwd = this.session.accessibility.password;

            if (sessionPwd) {
              if (password !== sessionPwd) {
                consoleError('Wrong password.');
                this.error += 'Wrong password.';
                return;
              } else {
                console.log('Correct password.');
              }
            }

            if (this.session.activity.playersJoinedAmount < this.session.restrictions.playersLimit) {
              console.log('Can join.');
            } else {
              consoleError(`Too many players (reached limit: ${this.session.restrictions.playersLimit}).`);
              this.error += `Too many players (reached limit: ${this.session.restrictions.playersLimit}).`;
              return;
            }

            const [res, err] = await tryCatch(this.apSession.addPlayerToSession(playerId, id));
            if (err) {
              consoleError(err);

              this.error += `\n\n${err}.`;

              return;
            } else {
              console.log('Success');
              this.popup.hidePopup();
              this.router.navigate(['/asian-poker/waiting-room/' + id]);
            }
          }
        } else {
          consoleError(`Session with id ${id} not found.`);
          this.error += `Session with id ${id} not found.`;
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
// II. Leaving can occur in two states: 'setup' and in-'game'.
// Setup waits for player for 30 seconds (unless he's a host); 'in-game' waits for player for 15 seconds. If player was a host, he gets replaced.
// After that time, player is kicked off the session. That means:  update session.playersJoinedIds and session.playersJoinedAmount.
//
// III. If host leaves during 'setup' state:
// - and there is no other players waiting --> session is deleted after 1 minute
// - and there are other players waiting --> host is replaced by one of players if he doesn't join in 30 seconds
