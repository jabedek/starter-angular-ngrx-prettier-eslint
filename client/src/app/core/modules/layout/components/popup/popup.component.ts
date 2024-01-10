import { Component, Injector } from '@angular/core';
import { Subject, Observable, take, map } from 'rxjs';
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

  currentContent$ = this.popup.currentContent$.pipe(
    map((curr) => {
      if (curr?.contentType === 'component') {
        const Component = curr.content.component; // note: we're passing type here
        const injector = Injector.create([{ provide: Component, useValue: new Component({ ...curr.content.inputs }) }], this.inj);
        return { ...curr, Component, Injector: injector };
      } else {
        return curr;
      }
    }),
  );

  constructor(
    private popup: PopupService,
    private inj: Injector,
  ) {}

  protected userAction(decision: 'accept' | 'decline' | 'close-no-decision', data: PopupData) {
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
