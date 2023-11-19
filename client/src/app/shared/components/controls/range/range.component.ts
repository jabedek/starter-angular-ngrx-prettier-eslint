import { Component, ElementRef, Input, Renderer2, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-range',
  templateUrl: './range.component.html',
  styleUrls: ['./range.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RangeComponent),
      multi: true,
    },
  ],
})
export class RangeComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() showValues = false;
  @Input({ required: true }) min = 0;
  @Input({ required: true }) max = 0;
  @Input({ required: true }) step = 0;
  onChange: any = () => ({});
  onTouch: any = () => ({});

  // this is the updated value that the class accesses
  set value(val) {
    // this value is updated by programmatic changes if( val !== undefined && this.val !== val){
    this._value = val;
    this.onChange(val);
    this.onTouch(val);
  }
  get value(): boolean {
    return this._value;
  }
  private _value = false;

  disabled = false;

  constructor(
    private _renderer: Renderer2,
    private _elementRef: ElementRef,
  ) {}

  // this method sets the value programmatically
  writeValue(value: boolean): void {
    this.value = value;
    this._renderer.setProperty(this._elementRef.nativeElement, 'value', value);
  }

  // upon UI element value changes, this method gets triggered
  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  // upon touching the element, this method gets triggered
  registerOnTouched(fn: (_: any) => void): void {
    this.onTouch = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
    this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', disabled);
  }
}
