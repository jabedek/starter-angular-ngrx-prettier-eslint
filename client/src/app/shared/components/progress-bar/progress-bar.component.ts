// progress-bar.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
})
export class ProgressBarComponent {
  @Input() currentValue: number | undefined = 0;
  @Input() maxValue: number | undefined = 0;
  @Input() color = '#00aeff';

  setValue(value: number) {
    this.currentValue = value;
  }

  get progress() {
    if (this.currentValue && this.maxValue) {
      return (this.currentValue / this.maxValue) * 100;
    } else {
      return 0;
    }
  }

  get boxShadow() {
    return `0px 0px 7px ${this.color}`;
  }
}
