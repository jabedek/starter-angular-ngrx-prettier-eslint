import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ControlValueAccessor } from '@angular/forms';
import { Router } from '@angular/router';
import { AsianPokerService } from '@core/firebase/asian-poker.service';
import { AsianPokerSessionForm } from '@features/entertainment/asian-poker/asian-poker-lobby.model';
import { Store } from '@ngrx/store';
import { InputOption } from '@shared/common-modules';
import { BaseComponent } from '@shared/components/base/base.component';
import { consoleError } from '@shared/helpers/common.utils';
import { AppState } from '@store/app-state';
import { selectUserAppAccount } from '@store/auth/auth.selectors';
import { UserAppAccount } from '@store/auth/auth.state';
import { generateDocumentId } from 'frotsi';
import { Observable, tap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-make-game',
  templateUrl: './make-game.component.html',
  styleUrls: ['./make-game.component.scss'],
})
export class MakeGameComponent extends BaseComponent {
  sessionForm = new FormGroup({
    hostId: new FormControl({ value: '', disabled: true }, [Validators.required]),
    hostDisplayName: new FormControl({ value: '', disabled: true }, [Validators.required]),
    title: new FormControl({ value: '', disabled: false }, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(15),
    ]),
    playersLimit: new FormControl({ value: 3, disabled: false }, [Validators.required]),
    accessibility: new FormControl({ value: '', disabled: false }, [Validators.required]),
    visibility: new FormControl({ value: '', disabled: false }, [Validators.required]),
    actionDurationSeconds: new FormControl({ value: 0, disabled: false }, [Validators.required, Validators.min(60)]),
  });

  visibilityValues: InputOption[] = ['private', 'public'].map((value) => ({ label: value, value }));
  accessibilityValues: InputOption[] = ['invite', 'all'].map((value) => ({ label: value, value }));

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
    super('MakeGameComponent');

    this.appAccount$.subscribe();
  }

  create() {
    if (this.sessionForm.valid) {
      const id = generateDocumentId('ap_session');
      const data = { ...this.sessionForm.getRawValue(), id } as AsianPokerSessionForm;

      this.ap
        .startNewSession(data)
        .then(() => {
          this.ap
            .addPlayerToSession(data.hostId, id)
            .then(() => {
              // this.router.navigate(['/asian-poker/game/' + id]);
              this.router.navigate(['/asian-poker/setup/' + id]);
            })
            .catch((e) => consoleError(e));
        })
        .catch((e) => consoleError(e));
    }
  }

  reset() {
    this.sessionForm.reset();
    this.sessionForm.controls.playersLimit.setValue(3);
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
