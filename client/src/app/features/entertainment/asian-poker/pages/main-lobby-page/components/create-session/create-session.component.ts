import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ControlValueAccessor } from '@angular/forms';
import { Router } from '@angular/router';
import { AsianPokerService } from '@features/entertainment/asian-poker/firebase/asian-poker.service';
import {
  SessionAccessibility,
  SessionListVisibility,
} from '@features/entertainment/asian-poker/models/types/session-game-chat/session.model';
import { Store } from '@ngrx/store';
import { InputOption } from '@shared/models/common.models';
import { BaseComponent } from '@shared/abstracts/base/base.component';
import { consoleError } from '@shared/helpers/common.utils';
import { AppState } from '@store/app-state';
import { selectUserAppAccount } from '@store/auth/auth.selectors';
import { UserAppAccount } from '@store/auth/auth.state';
import { generateDocumentId } from 'frotsi';
import { Observable, tap, takeUntil } from 'rxjs';
import { AppCheckboxEvent } from '@shared/components/controls/checkbox/checkbox.component';
// import { OFFICIAL_CONFIG } from '@features/entertainment/asian-poker/config';
import { AsianPokerSessionService } from '@features/entertainment/asian-poker/firebase/asian-poker-session.service';

export type AsianPokerSessionCreationForm = {
  id: string;
  hostId: string;
  hostDisplayName: string;
  title: string;
  playersLimit: number;
  actionDurationSeconds: number;
  spectatorsAllowed: boolean;
  password: string | null;
  inviteNeeded: boolean;
  listability: SessionListVisibility;
};

// const CONFIG = OFFICIAL_CONFIG.sessionCreation;
@Component({
  selector: 'app-create-session',
  templateUrl: './create-session.component.html',
  styleUrls: ['./create-session.component.scss'],
})
export class CreateSessionComponent extends BaseComponent {
  durationStep = 15;
  duration = this.durationStep * 3;

  sessionForm = new FormGroup({
    hostId: new FormControl({ value: '', disabled: true }, [Validators.required]),
    hostDisplayName: new FormControl({ value: '', disabled: true }, [Validators.required]),
    title: new FormControl({ value: this.defaultTitle(), disabled: false }, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(15),
    ]),
    password: new FormControl({ value: '', disabled: false }),
    playersLimit: new FormControl({ value: 3, disabled: false }, [Validators.required, Validators.min(3), Validators.max(6)]),
    listability: new FormControl<SessionListVisibility>({ value: 'public', disabled: false }, [Validators.required]),
    inviteNeeded: new FormControl<boolean>({ value: false, disabled: false }, [Validators.required]),
    spectatorsAllowed: new FormControl({ value: true, disabled: false }, [Validators.required]),
    actionDurationSeconds: new FormControl({ value: this.duration, disabled: false }, [
      Validators.required,
      Validators.min(this.duration),
    ]),
  });

  listabilityValues: InputOption[] = ['public', 'private'].map((value) => ({
    label: `ASIAN_POKER.IN_LOBBY.SETTINGS.LISTABILITY_${value.toUpperCase()}`,
    value,
  }));

  inviteValues: InputOption[] = ['all', 'invite'].map((value) => ({
    label: `ASIAN_POKER.IN_LOBBY.SETTINGS.ACCESSIBILITY_${value.toUpperCase()}`,
    value: value === 'invite',
  }));

  appAccount$: Observable<UserAppAccount | undefined> = this.store.select(selectUserAppAccount).pipe(
    tap((a) => {
      const id = this.sessionForm.controls.hostId;
      id.setValue(a?.id || '');
      id.updateValueAndValidity();

      const displayName = this.sessionForm.controls.hostDisplayName;
      displayName.setValue(a?.displayName || '');
      displayName.updateValueAndValidity();
    }),
    takeUntil(this.__destroy),
  );

  constructor(
    private store: Store<AppState>,
    private ap: AsianPokerService,
    private apSession: AsianPokerSessionService,
    private router: Router,
  ) {
    super('CreateSessionComponent');

    this.appAccount$.subscribe();
  }

  create() {
    if (this.sessionForm.valid) {
      const id = generateDocumentId('session');
      const data = { ...this.sessionForm.getRawValue(), id } as AsianPokerSessionCreationForm;

      this.apSession.createNewSession(data).then(() => {
        this.apSession
          .addPlayerToSession(data.hostId, id)
          .then(() => {
            // this.router.navigate(['/asian-poker/game/' + id]);
            this.router.navigate(['/asian-poker/waiting-room/' + id]);
          })
          .catch((e) => consoleError(e));
      });
    }
  }

  reset() {
    const { hostId, hostDisplayName } = this.sessionForm.getRawValue();
    this.sessionForm.reset();
    this.sessionForm.controls.playersLimit.setValue(3);
    this.sessionForm.controls.hostId.setValue(hostId);
    this.sessionForm.controls.hostDisplayName.setValue(hostDisplayName);
    this.sessionForm.controls.actionDurationSeconds.enable();
    this.sessionForm.controls.actionDurationSeconds.setValue(0);
    this.sessionForm.updateValueAndValidity();
  }

  unlimitedDuration(event: AppCheckboxEvent) {
    const disabled = event.value;
    const ctrl = this.sessionForm.controls.actionDurationSeconds;
    if (disabled) {
      ctrl.disable();
      ctrl.setValue(99999);
    } else {
      ctrl.enable();
      ctrl.setValue(0);
    }
  }

  private defaultTitle() {
    const now = Date.now().toString();
    return `Session ${now.substring(1, 4)}${now.substring(5, 9)}`;
  }
}
