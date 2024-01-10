import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, Input, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-see-data',
  template: `
    <pre appFreeDragging [ngStyle]="{ position }"> {{ data | json }} </pre>
  `,
  styleUrls: ['./see-data.component.scss'],
})
export class SeeDataComponent {
  @Input() set data(data: any) {
    this._data = data;
    this.dataOnSet();
  }
  get data(): any {
    return this._data;
  }
  private _data: any = undefined;
  private dataOnSet(args?: any) {
    return;
  }

  @Input() set attachToLayout(attachToLayout: boolean) {
    this._attachToLayout = attachToLayout;
    this.attachToLayoutOnSet(attachToLayout);
  }
  get attachToLayout(): boolean {
    return this._attachToLayout;
  }
  private _attachToLayout = false;
  private attachToLayoutOnSet(attachToLayout: boolean) {
    if (attachToLayout) {
      this.attach();
    }
    return;
  }

  @Input() position = 'relative';

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
  ) {
    if (this.attachToLayout) {
      this.attach();
    }
  }

  attach() {
    const layout = this.document.querySelector('app-layout');
    this.renderer.appendChild(layout, this.el.nativeElement);
  }
}
