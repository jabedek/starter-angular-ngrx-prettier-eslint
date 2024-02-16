import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PopupService } from '@core/modules/layout/components/popup/popup.service';
import { AsianPokerService } from '@features/entertainment/asian-poker/firebase/asian-poker.service';

@Component({
  selector: 'app-invite-player-popup',
  templateUrl: './invite-player-popup.component.html',
  styleUrls: ['./invite-player-popup.component.scss'],
})
export class InvitePlayerPopupComponent {
  error = '';

  @Input() order: number | null = null;
  @Input() sessionId = '';
  inviteForm = new FormGroup({
    playerEmail: new FormControl('', { validators: [Validators.required, Validators.email] }),
    additionalText: new FormControl('', { validators: [Validators.required] }),
  });

  constructor(
    private ap: AsianPokerService,
    private popup: PopupService,
    private router: Router,
  ) {}

  invite() {
    const { playerEmail, additionalText } = this.inviteForm.getRawValue();
    if (this.order && playerEmail && additionalText) {
      this.ap
        .invite(this.sessionId, { playerEmail, additionalText }, this.order)
        .then(() => {
          // show toast
          this.popup.hidePopup();
        })
        .catch((error) => {
          console.log(error);
          this.error = error.message;
        });
    }
  }
}
