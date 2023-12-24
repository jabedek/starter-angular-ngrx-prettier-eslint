import { AfterViewInit, Directive, ElementRef, EventEmitter, Output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appMutable]',
})
export class MutableDirective implements AfterViewInit {
  @Output() appMutable = new EventEmitter<string>();

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private _renderer: Renderer2,
  ) {}

  ngAfterViewInit(): void {
    const parent = this.elementRef.nativeElement;
    const children = parent.childNodes;

    let labelNode: ChildNode | undefined;
    let valueNode: ChildNode | undefined;

    children.forEach((val, key, parent) => {
      if ((val as HTMLElement).classList.value.includes('mutable-label')) {
        labelNode = val;
      }
      if ((val as HTMLElement).classList.value.includes('mutable-value')) {
        valueNode = val;
      }
    });

    if (labelNode && valueNode) {
      const currentValue = (valueNode as HTMLInputElement).value;

      labelNode.removeEventListener('click', null);
      labelNode.addEventListener('click', () => {
        this._renderer.addClass(parent, 'active');
        this._renderer.setProperty(valueNode, 'disabled', false);
        (valueNode as HTMLElement).focus();

        valueNode?.addEventListener(
          'focusout',
          () => {
            this._renderer.removeClass(parent, 'active');
            this._renderer.setProperty(valueNode, 'disabled', true);
            const newValue = (valueNode as HTMLInputElement).value.trim();
            if (currentValue !== newValue) {
              this.appMutable.emit(newValue);
            }
          },
          { once: true },
        );
      });
    }
  }
}
