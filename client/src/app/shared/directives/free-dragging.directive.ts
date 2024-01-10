import { DOCUMENT } from '@angular/common';
import { Directive, OnInit, OnDestroy, ElementRef, Inject } from '@angular/core';
import { Subscription, fromEvent, takeUntil } from 'rxjs';

@Directive({
  selector: '[appFreeDragging]',
})
export class FreeDraggingDirective implements OnInit, OnDestroy {
  private element: HTMLElement | undefined;

  private subscriptions: Subscription[] = [];

  constructor(
    private elementRef: ElementRef,
    @Inject(DOCUMENT) private document: any,
  ) {}

  ngOnInit(): void {
    this.element = this.elementRef.nativeElement as HTMLElement;
    this.initDrag();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s?.unsubscribe());
  }

  initDrag(): void {
    const element = this.element;

    if (element) {
      const dragStart$ = fromEvent<MouseEvent>(element, 'mousedown');
      const dragEnd$ = fromEvent<MouseEvent>(this.document, 'mouseup');
      const drag$ = fromEvent<MouseEvent>(this.document, 'mousemove').pipe(takeUntil(dragEnd$));

      let initialX: number,
        initialY: number,
        currentX = 0,
        currentY = 0;

      let dragSub: Subscription;

      const dragStartSub = dragStart$.subscribe((event: MouseEvent) => {
        initialX = event.clientX - currentX;
        initialY = event.clientY - currentY;
        element.classList.add('free-dragging');

        dragSub = drag$.subscribe((event: MouseEvent) => {
          event.preventDefault();
          this.subscriptions.push(dragStartSub, dragSub, dragEndSub);

          currentX = event.clientX - initialX;
          currentY = event.clientY - initialY;

          element.style.transform = 'translate3d(' + currentX + 'px, ' + currentY + 'px, 0)';
        });
      });

      const dragEndSub = dragEnd$.subscribe(() => {
        initialX = currentX;
        initialY = currentY;
        element.classList.remove('free-dragging');
        if (dragSub) {
          dragSub.unsubscribe();
        }
      });
    }
  }
}
