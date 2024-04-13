import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, Renderer2, forwardRef } from '@angular/core';
import { CheckboxControlValueAccessor, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AccessEvent } from '@shared/models/events.models';

export type AppCheckboxEvent = { value: boolean; inputEvent: MouseEvent | KeyboardEvent; inputWrapper: CheckboxComponent };
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
  @Input() disabled = false;
  @Input() mini = false;

  @Input() set value(value: boolean) {
    if (!this.disabled) {
      this._value = value;
      this.onChange(value); // ?
      this.onTouched();
    }
  }
  get value(): boolean {
    return this._value;
  }
  private _value = false;

  @Output() appChange = new EventEmitter<AppCheckboxEvent>();

  constructor(_elementRef: ElementRef, _renderer: Renderer2) {
    super(_renderer, _elementRef);
    this.elementRef = _elementRef;
    this.renderer = _renderer;
  }

  override writeValue(value: any): void {
    this._value = value;
  }

  override registerOnChange(fn: (_: any) => {}): void {
    this.onChange = fn;
  }

  override registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  override setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled); // ?
  }

  override onChange: (_: any) => void = (_: any) => ({});
  override onTouched: () => void = () => ({});

  handleSelect(event: AccessEvent): void {
    if (!this.disabled) {
      this.value = !this.value;
      this.emitChange(this.value, event.event);
    }
  }

  emitChange(val: boolean, event: MouseEvent | KeyboardEvent): void {
    if (!this.disabled) {
      this.appChange.emit({ value: val, inputEvent: event, inputWrapper: this });
      this.onChange(val);
    }
  }

  // ngOnInit(): void {
}
