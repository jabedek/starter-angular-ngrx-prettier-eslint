import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { BaseComponent } from '@shared/abstracts/base/base.component';

@Component({
  selector: 'app-lobby-page',
  templateUrl: './lobby-page.component.html',
  styleUrls: ['./lobby-page.component.scss'],
})
export class LobbyPageComponent implements AfterViewInit {
  constructor(private el: ElementRef) {
    console.log('LobbyPageComponent created');

    if (!(window as any)['lobby']) {
      (window as any)['lobby'] = 0;
    }

    (window as any)['lobby'] = (window as any)['lobby'] + 1;

    console.log((window as any)['lobby']);
  }

  ngAfterViewInit(): void {
    const el = this.el.nativeElement as HTMLElement;
    el.addEventListener('beforeunload', function (e) {
      alert('Lobby page beforeunload');
    });
  }
}
