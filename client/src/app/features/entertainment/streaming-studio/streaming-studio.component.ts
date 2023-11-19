import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { BaseComponent } from '@shared/components/base/base.component';
import { Subject, debounceTime, takeUntil } from 'rxjs';

@Component({
  selector: 'app-streaming-studio',
  templateUrl: './streaming-studio.component.html',
  styleUrls: ['./streaming-studio.component.scss'],
})
export class StreamingStudioComponent extends BaseComponent implements OnDestroy, AfterViewInit {
  @ViewChild('videoEl') set videoEl(videoEl: ElementRef<HTMLVideoElement> | undefined) {
    this._videoEl = videoEl;
    this.videoElOnSet();
  }
  get videoEl(): ElementRef<HTMLVideoElement> | undefined {
    return this._videoEl;
  }
  private _videoEl: ElementRef<HTMLVideoElement> | undefined = undefined;
  private videoElOnSet(args?: any) {
    return;
  }

  supportedConstraints: MediaTrackSupportedConstraints | undefined;
  stream: MediaStream | undefined;
  track: MediaStreamTrack | undefined;

  get devices() {
    return navigator.mediaDevices;
  }

  applyChanges = new Subject<{ key: string; value: number }>();
  applyChanges$ = this.applyChanges.asObservable().pipe(debounceTime(0), takeUntil(this.__destroy));

  capabilitiesOther: Record<string, { details: any; value: any }> = {};
  capabilitiesRanged: Record<string, Record<string, any>> = {
    ptz: {},
    working: {},
    notWorking: {},
  };

  constructor() {
    super();
  }

  ngAfterViewInit() {
    this.handlePermissions();
  }

  override ngOnDestroy(): void {
    this.stream?.getTracks().forEach((track) => track.stop());
    this.devices.ondevicechange = null;
  }

  private async handlePermissions() {
    const queryObj = {
      name: 'camera' as PermissionName,
      panTiltZoom: true,
    } as any;

    try {
      const panTiltZoomPermissionStatus = await navigator.permissions.query(queryObj);

      if (panTiltZoomPermissionStatus.state == 'granted') {
        console.log('here granted');
        this.setupDeviceAndStream();
      }
      if (panTiltZoomPermissionStatus.state == 'prompt') {
        console.log('here prompt');
        this.setupDeviceAndStream();
      }

      panTiltZoomPermissionStatus.addEventListener('change', () => {
        console.log('here change');
        // User has changed PTZ permission status.
      });
    } catch (error) {
      console.log(error);
    }
  }

  private async setupDeviceAndStream() {
    const devices = this.devices;
    if (devices) {
      this.supportedConstraints = devices.getSupportedConstraints();
      devices.ondevicechange = (event) => console.log('Device change', event.type, event);
      try {
        const videoObj = {
          pan: true,
          tilt: true,
          zoom: true,
          advanced: [
            // { width: 1920, height: 1280 },
            // { aspectRatio: 4 / 3 },
            { facingMode: 'environment' },
          ],
        };

        const stream = await devices.getUserMedia({
          video: videoObj,
        });
        stream.onaddtrack = (event) => console.log('onaddtrack', event);
        stream.onremovetrack = (event) => console.log('onremovetrack', event);
        this.stream = stream;

        this.setupStreamPreview(stream);
        this.setupTrackSettingsInputs(stream);
      } catch (error) {
        console.error(error);
      }
    }
  }

  private setupTrackSettingsInputs(stream: MediaStream) {
    const track = stream.getTracks()[0];
    const capabilities = track.getCapabilities();
    const settings = track.getSettings();
    console.log(settings);

    const visiblyWorkingSettings = ['brightness', 'contrast', 'saturation', 'sharpness'];
    const ptzSettings = ['pan', 'tilt', 'zoom'];

    Object.entries(capabilities).forEach(([k, v]) => {
      const key = k as keyof MediaTrackSettings;

      const visiblyWorking = visiblyWorkingSettings.includes(k.toString());
      const ptz = ptzSettings.includes(k.toString());

      const rangedCaps = ptz
        ? this.capabilitiesRanged.ptz
        : visiblyWorking
        ? this.capabilitiesRanged.working
        : this.capabilitiesRanged.notWorking;

      if (v.step) {
        rangedCaps[key] = { ...v, value: settings[key] as any };
      } else {
        this.capabilitiesOther[key] = { details: v, value: settings[key] };
      }

      if (k === 'exposureTime') {
        rangedCaps[key].step = 5.0;
        rangedCaps[key].min = 5.0;
        rangedCaps[key].value = 5.0;
      }
    });

    this.applyChanges$.subscribe(async ({ key, value }) => {
      if (track) {
        await track.applyConstraints({ advanced: [{ [key]: value }] });
      }
    });
  }

  private setupStreamPreview(stream: MediaStream) {
    const video = this.videoEl?.nativeElement;

    if (video) {
      video.srcObject = stream;
      video.onloadedmetadata = () => video.play();
    }
  }
}
