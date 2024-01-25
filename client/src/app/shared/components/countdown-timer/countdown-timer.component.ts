// countdown-timer.component.ts
import { Component, Input, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-countdown-timer',
  template: `
    <div [ngClass]="{ done }">{{ hours }}:{{ minutes }}:{{ seconds }}</div>
  `,
  styleUrls: ['./countdown-timer.component.scss'],
})
export class CountdownTimerComponent implements OnInit, OnDestroy {
  @Output() timeup = new EventEmitter<void>();
  @Input() milliseconds = 0;
  hours = '00';
  minutes = '00';
  seconds = '00';
  done = false;
  private intervalId: NodeJS.Timeout | undefined;

  ngOnInit() {
    this.updateTime();
    this.intervalId = setInterval(() => {
      this.milliseconds -= 1000;
      this.updateTime();
      if (this.milliseconds === 5000) {
        this.done = true;
      }

      if (this.milliseconds <= 0) {
        clearInterval(this.intervalId);
        this.hours = '00';
        this.minutes = '00';
        this.seconds = '00';
        this.done = true;
        this.timeup.emit();
      }
    }, 1000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private updateTime() {
    const totalSeconds = Math.floor(this.milliseconds / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);

    this.seconds = String(totalSeconds % 60).padStart(2, '0');
    this.minutes = String(totalMinutes % 60).padStart(2, '0');
    this.hours = String(totalHours).padStart(2, '0');
  }
}
