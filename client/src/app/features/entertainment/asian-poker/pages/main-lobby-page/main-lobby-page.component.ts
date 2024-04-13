import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { AppFormControl, AppFormGroup } from '@shared/extensions/form-reset-event';
@Component({
  selector: 'app-main-lobby-page',
  templateUrl: './main-lobby-page.component.html',
  styleUrls: ['./main-lobby-page.component.scss'],
})
export class MainLobbyPageComponent implements AfterViewInit {
  form = new AppFormGroup({
    name: new AppFormControl('John'),
    age: new AppFormControl(20),
  });

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    const el = this.el.nativeElement as HTMLElement;
    el.addEventListener('beforeunload', function (e) {
      alert('Lobby page beforeunload');
    });
  }

  handleCountdown() {}
}
