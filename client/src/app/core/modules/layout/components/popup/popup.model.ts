import { Type } from '@angular/core';

export type ComponentPopupContent<C> = {
  component: Type<C>;
  inputs?: Record<string, unknown>;
};
export type SimplePopupContent = {
  textContent: string;
  textHeader?: string;
  showAcceptButton: boolean;
  showDeclineButton: boolean;
  closeOnDecision: boolean;
  callbackAfterAccept?: () => unknown;
  callbackAfterDecline?: () => unknown;
};

export type PopupConfig = {
  showCloseButton: boolean;
  callbackAfterClosing?: (...args: unknown[]) => unknown;
};

type P1<C> = {
  contentType: 'component';
  content: ComponentPopupContent<C>;
  config: PopupConfig;
};

type P2<C> = {
  contentType: 'simple';
  content: SimplePopupContent;
  config: PopupConfig;
};

export type PopupData<C = void> = P1<C> | P2<C>;
