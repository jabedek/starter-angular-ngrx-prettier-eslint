import { Component } from '@angular/core';
import { Subject, Observable, take } from 'rxjs';
import { PopupService } from './popup.service';
import { PopupData } from './popup.model';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
})
export class PopupComponent {
  private userActionNext = new Subject<'accept' | 'decline' | 'close-no-decision'>();
  userAction$ = this.userActionNext.asObservable();

  currentContent$: Observable<PopupData | undefined> = this.popup.currentContent$;

  constructor(private popup: PopupService) {}

  protected userAction(decision: 'accept' | 'decline' | 'close-no-decision', data: PopupData) {
    console.log(decision);
    const { callbackAfterClosing } = data.config;

    if (decision === 'close-no-decision') {
      this.popup.hidePopup();
      if (callbackAfterClosing) {
        callbackAfterClosing();
      }
    } else {
      if (data.contentType === 'simple') {
        const { closeOnDecision, callbackAfterAccept } = data.content;
        if (closeOnDecision) {
          this.popup.hidePopup();

          if (callbackAfterAccept) {
            callbackAfterAccept();
          }
        }
      }
    }
  }

  // public manage(config: PopupGlobalConfig) {
  //   // this.config = config;
  //   return this.userAction$.pipe(take(1));
  // }
}
