import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-asian-poker-button',
  templateUrl: './asian-poker-button.component.html',
  styleUrls: ['./asian-poker-button.component.scss'],
})
export class AsianPokerButtonComponent {
  @Input() variant: 'default' | 'action0' | 'action1' | 'mini--reject' | 'mini--confirm' = 'default';
  @Input() round = false;
  @Input() disabled = false;
}
