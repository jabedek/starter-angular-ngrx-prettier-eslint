import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent {
  @Input() sizePx = 32;
  @Input() borderPx = 3.6;
  @Input() color = 'gray';
}
