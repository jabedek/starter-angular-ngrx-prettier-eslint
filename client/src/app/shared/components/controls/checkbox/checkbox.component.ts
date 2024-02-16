import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, Renderer2, forwardRef } from '@angular/core';
import { CheckboxControlValueAccessor, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
})
export class CheckboxComponent extends CheckboxControlValueAccessor {
  elementRef: ElementRef;
  renderer: Renderer2;
  @Input({ required: true }) label = '';
  @Input() mini = false;
  @Output() change = new EventEmitter<{ target: { checked: boolean } }>();
  onTouch = (arg: boolean) => ({});

  @Input() set value(val: boolean) {
    if (!this.disabled) {
      console.log(val);

      this._value = val;
      this.emitChange(val);
      this.onTouch(val);
    }
  }
  get value(): boolean {
    return this._value;
  }
  private _value = false;

  @Input() disabled = false;

  constructor(_elementRef: ElementRef, _renderer: Renderer2) {
    super(_renderer, _elementRef);
    this.elementRef = _elementRef;
    this.renderer = _renderer;
  }

  emitChange(val: boolean) {
    if (!this.disabled) {
      this.change.emit({ target: { ...this, checked: val } });
      this.onChange(val);
      console.log(val);
    }
  }
}
