import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
})
export class PopupComponent {
  @Input() showAccept = false;
  @Input() showDecline = false;
  @Input() showClose = true;
  @Input() closeOnDecision = false;

  @Input() set popupShown(popupShown: boolean) {
    this._popupShown = popupShown;
  }
  get popupShown() {
    return this._popupShown;
  }
  private _popupShown = false;

  @Output() action = new EventEmitter<'accept' | 'decline' | 'close-no-decision'>();
  @Output() mode = new EventEmitter<'shown' | 'hidden'>();
  @Output() declinedOnDecision = new EventEmitter<void>();

  protected decide(decision: 'accept' | 'decline' | 'close-no-decision') {
    console.log(decision);

    if (decision === 'close-no-decision') {
      this.popupShown = false;
    } else {
      if (this.closeOnDecision) {
        this.popupShown = false;
      }
    }
    this.mode.emit('hidden');
    this.action.emit(decision);
  }

  public openProgrammatically = () => {
    this.mode.emit('shown');
    this.popupShown = true;
  };

  public closeProgrammatically() {
    this.mode.emit('hidden');
    this.popupShown = false;
  }
}
