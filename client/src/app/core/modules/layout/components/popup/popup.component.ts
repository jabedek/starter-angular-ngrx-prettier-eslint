import { Component, Injector, Type, ViewChild, ViewContainerRef } from '@angular/core';
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
  @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef | undefined;

  userAction$ = this.userActionNext.asObservable();
  closeOnOutclick = false;

  constructor(
    private popup: PopupService,
    private inj: Injector,
  ) {}

  currentContent$ = this.popup.currentContent$.pipe(
    map((curr) => {
      this.closeOnOutclick = !!curr?.config.closeOnOutclick;
      if (curr?.contentType === 'component') {
        const Component: Type<unknown> = curr.content.component; // note: we're passing type here
        const Comp = new Component();
        const injector = Injector.create([{ provide: Component, useValue: Comp }], this.inj);
        return { ...curr, Component, Injector: injector };
      } else {
        return curr;
      }
    }),
  );

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

  handleOutclick(event: Event) {
    if (this.closeOnOutclick) {
      const target = event.target as HTMLElement;
      if (target.classList.contains('_popup_')) {
        console.log('handleOutclick');

        this.popup.hidePopup();
      }
    }
  }

  // public manage(config: PopupGlobalConfig) {
  //   // this.config = config;
  //   return this.userAction$.pipe(take(1));
  // }
}
