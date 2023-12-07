import { Type } from '@angular/core';

export type ComponentPopupContent = {
  component: Type<any>;
  inputs: Record<string, unknown>;
};
export type SimplePopupContent = {
  textContent: string;
  textHeader?: string;
  showAcceptButton: boolean;
  showDeclineButton: boolean;
  closeOnDecision: boolean;
  callbackAfterDecision?: (decision: 'accept' | 'decline') => unknown;
};

export type PopupConfig = {
  showCloseButton: boolean;
  callbackAfterClosing?: (...args: unknown[]) => unknown;
};

type P1 = {
  contentType: 'component';
  content: ComponentPopupContent;
  config: PopupConfig;
};

type P2 = {
  contentType: 'simple';
  content: SimplePopupContent;
  config: PopupConfig;
};

export type PopupData = P1 | P2;
