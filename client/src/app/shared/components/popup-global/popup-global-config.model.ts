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
  callbackAfterAccept?: (decision: 'accept' | 'decline') => unknown;
};

export type PopupConfig = {
  showCloseButton: boolean;
  callbackAfterClosing?: (...args: unknown[]) => unknown;
};

export type PopupData = {
  content: ComponentPopupContent | SimplePopupContent;
  config: PopupConfig;
};
