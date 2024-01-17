import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { PopupData } from './popup.model';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  private currentContentEmitter = new BehaviorSubject<PopupData<unknown> | undefined>(undefined);
  currentContent$ = this.currentContentEmitter.asObservable();

  showPopup<C>(data: PopupData<C>) {
    this.currentContentEmitter.next(data);
  }

  hidePopup() {
    this.currentContentEmitter.next(undefined);
  }
}
