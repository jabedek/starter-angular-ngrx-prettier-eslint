import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ControlValueAccessor } from '@angular/forms';
import { Router } from '@angular/router';
import { AsianPokerService } from '@features/entertainment/asian-poker/firebase/asian-poker.service';
import { AsianPokerSessionSettings } from '@features/entertainment/asian-poker/models/session.model';
import { Store } from '@ngrx/store';
import { InputOption } from '@shared/models/common.models';
import { BaseComponent } from '@shared/abstracts/base/base.component';
import { consoleError } from '@shared/helpers/common.utils';
import { AppState } from '@store/app-state';
import { selectUserAppAccount } from '@store/auth/auth.selectors';
import { UserAppAccount } from '@store/auth/auth.state';
import { generateDocumentId } from 'frotsi';
import { Observable, tap, takeUntil } from 'rxjs';

export type AsianPokerSessionCreationForm = AsianPokerSessionSettings & { id: string; hostId: string; hostDisplayName: string };

@Component({
  selector: 'app-create-session',
  templateUrl: './create-session.component.html',
  styleUrls: ['./create-session.component.scss'],
})
export class CreateSessionComponent extends BaseComponent {
  sessionForm = new FormGroup({
    hostId: new FormControl({ value: '', disabled: true }, [Validators.required]),
    hostDisplayName: new FormControl({ value: '', disabled: true }, [Validators.required]),
    title: new FormControl({ value: '', disabled: false }, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(15),
    ]),
    password: new FormControl({ value: '', disabled: false }),
    playersLimit: new FormControl({ value: 3, disabled: false }, [Validators.required]),
    accessibility: new FormControl({ value: '', disabled: false }, [Validators.required]),
    visibility: new FormControl({ value: '', disabled: false }, [Validators.required]),
    actionDurationSeconds: new FormControl({ value: 0, disabled: false }, [Validators.required, Validators.min(60)]),
  });

  visibilityValues: InputOption[] = ['public', 'private'].map((value) => ({ label: value, value }));
  accessibilityValues: InputOption[] = ['all', 'invite'].map((value) => ({ label: value, value }));

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

  unlimitedDuration(event: { target: { checked: boolean } }) {
    const disabled = event.target.checked;
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
