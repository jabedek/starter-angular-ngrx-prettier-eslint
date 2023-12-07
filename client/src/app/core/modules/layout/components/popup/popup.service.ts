import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { PopupData } from './popup.model';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  private currentContentEmitter = new BehaviorSubject<PopupData | undefined>(undefined);
  currentContent$ = this.currentContentEmitter.asObservable();

  showPopup(data: PopupData) {
    this.currentContentEmitter.next(data);
  }

  hidePopup() {
    this.currentContentEmitter.next(undefined);
  }
}
