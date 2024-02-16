import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { PopupData } from './popup.model';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  private currentContentEmitter = new BehaviorSubject<PopupData<unknown> | undefined>(undefined);
  currentContent$ = this.currentContentEmitter.asObservable();
  callback: CallableFunction | undefined;

  showPopup<C>(data: PopupData<C>) {
    if (data.config.callbackOnDestroy) {
      this.callback = data.config.callbackOnDestroy;
    }
    this.currentContentEmitter.next(data);
  }

  hidePopup() {
    if (this.callback) {
      this.callback();
    }
    this.currentContentEmitter.next(undefined);
  }
}
