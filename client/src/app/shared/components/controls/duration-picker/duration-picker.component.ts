import { Component, ElementRef, Input, Renderer2, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-duration-picker',
  templateUrl: './duration-picker.component.html',
  styleUrls: ['./duration-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DurationPickerComponent),
      multi: true,
    },
  ],
})
export class DurationPickerComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() step = 30;

  onChange: any = () => ({});
  onTouch: any = () => ({});

  // this is the updated value that the class accesses
  set value(val: number) {
    // this value is updated by programmatic changes if( val !== undefined && this.val !== val){
    this._value = val;
    this.onChange(val);
    this.onTouch(val);
  }
  get value(): number {
    return this._value;
  }
  private _value = 0;

  get displayDuration() {
    const minutes = Math.floor(this.value / 60);
    const seconds = this.value % 60;
    return this.value >= 9999 ? 'MAX' : `${minutes < 10 ? '0' + minutes : minutes}m ${seconds === 0 ? '0' + seconds : seconds}s`;
  }

  disabled = false;

  constructor(
    private _renderer: Renderer2,
    private _elementRef: ElementRef,
  ) {}

  increase() {
    if (!this.disabled) {
      this.value += this.step;
    }
  }

  decrease() {
    if (!this.disabled && this.value > 0) {
      this.value -= this.step;
    }
  }

  // this method sets the value programmatically
  writeValue(value: number): void {
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
