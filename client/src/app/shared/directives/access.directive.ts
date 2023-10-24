import { AfterViewInit, Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { AccessEvent } from '@shared/models/events.models';
/**
 * This directive fulfills these rules:
 *
 * * template/click-events-have-key-events
 *
 * * template/mouse-events-have-key-events
 *
 * by adding to parent element `tabindex` and event handlers for `click`, `keydown.enter`, `keydown.escape`.
 * TODO: add touch event for mobiles
 */
@Directive({
  selector: '[appAccess]',
})
export class AccessDirective implements AfterViewInit {
  @Input() appAccess: string | number = '0'; // tabindex
  @Output() access = new EventEmitter<AccessEvent>();
  @Output() escape = new EventEmitter<{
    eventName: `KeyboardEvent.Escape`;
    event: KeyboardEvent;
  }>();

  @HostListener('click', ['$event']) onClick($event: MouseEvent): void {
    this.emitEvent({ eventName: 'MouseEvent', event: $event });
  }
  @HostListener('keydown.enter', ['$event']) onKeyDownEnter($event: KeyboardEvent): void {
    this.emitEvent({ eventName: 'KeyboardEvent.Enter', event: $event });
  }
  @HostListener('keydown.escape', ['$event']) onKeyDownEscape($event: KeyboardEvent): void {
    this.escape.emit({ eventName: 'KeyboardEvent.Escape', event: $event });
  }

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    this.el.nativeElement.tabIndex = Number(this.appAccess) || 0;
    this.el.nativeElement.style.cursor = 'pointer';
  }

  private emitEvent(event: AccessEvent): void {
    this.access.emit(event);
  }
}
