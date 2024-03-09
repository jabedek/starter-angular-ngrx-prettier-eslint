import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ControlValueAccessor } from '@angular/forms';
import { Router } from '@angular/router';
import { AsianPokerService } from '@features/entertainment/asian-poker/firebase/asian-poker.service';
import {
  AsianPokerSessionSettings,
  SessionAccessibility,
  SessionVisibility,
} from '@features/entertainment/asian-poker/models/session-game-chat/session.model';
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
import { OFFICIAL_CONFIG } from '@features/entertainment/asian-poker/config';

export type AsianPokerSessionCreationForm = AsianPokerSessionSettings & { id: string; hostId: string; hostDisplayName: string };

const CONFIG = OFFICIAL_CONFIG.sessionCreation;
@Component({
  selector: 'app-create-session',
  templateUrl: './create-session.component.html',
  styleUrls: ['./create-session.component.scss'],
})
export class CreateSessionComponent extends BaseComponent {
  durationStep = CONFIG.actionDurationSeconds.durationStep;

  sessionForm = new FormGroup({
    hostId: new FormControl({ value: '', disabled: true }, [Validators.required]),
    hostDisplayName: new FormControl({ value: '', disabled: true }, [Validators.required]),
    title: new FormControl({ value: CONFIG.title.defaultVal, disabled: false }, [
      Validators.required,
      Validators.minLength(CONFIG.title.minLength),
      Validators.maxLength(CONFIG.title.maxLength),
    ]),
    password: new FormControl({ value: '', disabled: false }),
    playersLimit: new FormControl({ value: CONFIG.playersLimit.minVal, disabled: false }, [
      Validators.required,
      Validators.min(CONFIG.playersLimit.minVal),
    ]),
    accessibility: new FormControl<SessionAccessibility>({ value: CONFIG.accessibility.defaultVal, disabled: false }, [
      Validators.required,
    ]),
    visibility: new FormControl<SessionVisibility>({ value: CONFIG.visibility.defaultVal, disabled: false }, [
      Validators.required,
    ]),
    spectatorsAllowed: new FormControl({ value: CONFIG.spectatorsAllowed.defaultVal, disabled: false }, [Validators.required]),
    actionDurationSeconds: new FormControl({ value: CONFIG.actionDurationSeconds.minVal, disabled: false }, [
      Validators.required,
      Validators.min(CONFIG.actionDurationSeconds.minVal),
    ]),
  });

  visibilityValues: InputOption[] = ['public', 'private'].map((value) => ({
    label: `ASIAN_POKER.IN_LOBBY.SETTINGS.VISIBILITY_${value.toUpperCase()}`,
    value,
  }));

  accessibilityValues: InputOption[] = ['all', 'invite'].map((value) => ({
    label: `ASIAN_POKER.IN_LOBBY.SETTINGS.ACCESSIBILITY_${value.toUpperCase()}`,
    value,
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
    private router: Router,
  ) {
    super('CreateSessionComponent');

    this.appAccount$.subscribe();
  }

  create() {
    if (this.sessionForm.valid) {
      const id = generateDocumentId('ap_session');
      const data = { ...this.sessionForm.getRawValue(), id } as AsianPokerSessionCreationForm;

      this.ap.createNewSession(data).then(() => {
        this.ap
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
}
