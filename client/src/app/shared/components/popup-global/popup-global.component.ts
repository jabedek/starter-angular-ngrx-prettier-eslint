import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable, Subject, take } from 'rxjs';
import { PopupService } from '@core/modules/layout/components/popup/popup.service';

@Component({
  selector: 'app-popup-global',
  templateUrl: './popup-global.component.html',
  styleUrls: ['./popup-global.component.scss'],
})
export class PopupGlobalComponent {
  private userActionNext = new Subject<'accept' | 'decline' | 'close-no-decision'>();
  userAction$ = this.userActionNext.asObservable();

  currentContent$: Observable<any | undefined> = this.popup.currentContent$;

  constructor(private popup: PopupService) {}

  protected userAction(decision: 'accept' | 'decline' | 'close-no-decision') {
    if (decision === 'close-no-decision') {
      // this.config.isShown = false;
    } else {
      // if (this.config.closeOnDecision) {
      //   this.config.isShown = false;
      // }
    }
    this.userActionNext.next(decision);
  }

  public manage(config: any) {
    // this.config = config;
    return this.userAction$.pipe(take(1));
  }
}
