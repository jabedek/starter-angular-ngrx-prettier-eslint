import { Component, Input } from '@angular/core';

export const regexFloatingNumbers = /^\d+(\.?\d+)*/gm;
export const regexLetters = /[a-zA-Z]+$/gm;

@Component({
  selector: 'app-basic-card',
  templateUrl: './basic-card.component.html',
  styleUrls: ['./basic-card.component.scss'],
})
export class BasicCardComponent {
  @Input() set height(height: string | undefined) {
    this._height = height || '670px';

    const value = regexFloatingNumbers.exec(this._height);
    const unit = regexLetters.exec(this._height);

    if (value && unit) {
      const result = Number(value[0]) * 0.78;
      const newVal = `${result}${unit[0]}`;
      console.log(height, newVal);
      this._contentHeight = newVal;
    }
  }

  get height(): string {
    return this._height;
  }

  private _height = '670px';

  protected _contentHeight = '';
}
