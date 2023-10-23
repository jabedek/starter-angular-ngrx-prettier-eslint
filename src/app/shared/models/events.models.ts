export type AccessEvent = AccessKeyboardEvent | AccessMouseEvent;

interface AccessMouseEvent {
  eventName: 'MouseEvent';
  event: MouseEvent;
}

interface AccessKeyboardEvent {
  eventName: `KeyboardEvent.${'Enter' | 'Escape'}`;
  event: KeyboardEvent;
}
