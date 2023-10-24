import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-see-data',
  template: `
    <pre [ngStyle]="{ position }"> {{ data | json }} </pre>
  `,
  styleUrls: ['./see-data.component.scss'],
})
export class SeeDataComponent {
  @Input() data: any; // tslint:disable-line
  @Input() position = 'absolute';
}
