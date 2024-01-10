import { Directive, ElementRef, Output } from '@angular/core';
import { fromEvent, debounceTime } from 'rxjs';

@Directive({
  selector: '[appMousewheel]',
  standalone: true,
})
export class MousewheelDirective {
  @Output()
  previousPosition = -1;
  scroll = false;
  constructor(private wrapperElement: ElementRef<HTMLElement>) {
    this.listen();
  }

  private listen() {
    fromEvent<WheelEvent>(this.wrapperElement.nativeElement, 'wheel')
      .pipe(debounceTime(0))
      .subscribe((event: WheelEvent) => {
        // const position = event.wheelDelta || -event.detail;
        // if (event.wheelDelta >= 0) {
        //   console.log('go up');
        //   this.scroll = true;
        // } else {
        //   console.log('go down');
        //   this.scroll = false;
        // }
        // this.previousPosition = position;
        // event.stopImmediatePropagation();
        // event.stopPropagation();
        // event.preventDefault();
      });
  }
}
