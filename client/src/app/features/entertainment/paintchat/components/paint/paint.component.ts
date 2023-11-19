import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

const HEADER_HEIGHT_OFFSET_px = 60;
@Component({
  selector: 'app-paint',
  templateUrl: './paint.component.html',
  styleUrls: ['./paint.component.scss'],
})
export class PaintComponent implements AfterViewInit {
  brushColor = 'black';
  brushSize = 5;
  lastX = 0;
  lastY = 0;
  mousePressed = false;
  colors = ['firebrick', 'royalblue', 'black', 'gold', 'white', 'seagreen'];
  saveWithBg = true;
  mode: 'pen' | 'eraser' = 'pen';

  @ViewChild('canvasEl') set canvasEl(canvasEl: ElementRef<HTMLCanvasElement> | undefined) {
    this._canvasEl = canvasEl;
  }
  get canvasEl(): ElementRef<HTMLCanvasElement> | undefined {
    return this._canvasEl;
  }
  private _canvasEl: ElementRef<HTMLCanvasElement> | undefined = undefined;

  get canvasCtx(): CanvasRenderingContext2D | null | undefined {
    const canvas = this.canvasEl?.nativeElement;
    return canvas ? canvas.getContext('2d') : undefined;
  }

  @ViewChild('viewportEl') set viewportEl(viewportEl: ElementRef<HTMLDivElement> | undefined) {
    this._viewportEl = viewportEl;
  }
  get viewportEl(): ElementRef<HTMLDivElement> | undefined {
    return this._viewportEl;
  }
  private _viewportEl: ElementRef<HTMLDivElement> | undefined = undefined;

  ngAfterViewInit(): void {
    const canvas: HTMLCanvasElement | undefined = this.canvasEl?.nativeElement;
    if (canvas) {
      this.canvasResize();
      window.onresize = this.canvasResize;
    }
  }

  downloadImg(): void {
    const canvas = this.canvasEl?.nativeElement;
    if (canvas) {
      const ctx = canvas.getContext('2d');

      if (ctx && this.saveWithBg) {
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = '#444';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      const name = new Date().toISOString().substring(0, 19).replaceAll('-', '').replaceAll(':', '').replace('T', '');

      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = `${name}.png`;
      a.click();

      if (ctx) {
        ctx.globalCompositeOperation = 'source-over';
      }
    }
  }

  clearArea(): void {
    const canvasCtx = this.canvasCtx;
    if (canvasCtx)
      canvasCtx.setTransform(1, 0, 0, 1, 0, 0), canvasCtx.clearRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);
  }

  handleMouseDownCanvas(e: MouseEvent) {
    this.mousePressed = true;
    const canvas = this.canvasEl?.nativeElement;
    if (canvas) {
      const { pageX, pageY } = e;
      const { offsetLeft, offsetTop } = canvas;
      this.draw(pageX - offsetLeft, pageY - offsetTop, false);
    }
  }

  handleMouseMoveCanvas(e: MouseEvent) {
    const canvas = this.canvasEl?.nativeElement;
    if (canvas) {
      const { pageX, pageY } = e;
      const { offsetLeft, offsetTop } = canvas;
      if (this.mousePressed) {
        this.draw(pageX - offsetLeft, pageY - offsetTop, true);
      }
    }
  }

  handleTouchStartCanvas(e: TouchEvent) {
    this.mousePressed = true;
    const target = e.touches[0];
    const newEvent = new MouseEvent('mousedown', { clientX: target.clientX, clientY: target.clientY });
    this._canvasEl?.nativeElement.dispatchEvent(newEvent);
  }

  handleTouchMoveCanvas(e: TouchEvent) {
    const target = e.touches[0];
    const newEvent = new MouseEvent('mousemove', { clientX: target.clientX, clientY: target.clientY });
    this._canvasEl?.nativeElement.dispatchEvent(newEvent);
  }

  private canvasResize(): void {
    const canvas = this.canvasEl?.nativeElement;
    if (canvas) {
      if (window.screen.width <= 600) {
        canvas.width = window.innerWidth;
        canvas.height = 0.65 * window.innerHeight;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = 500;
      }
    }
  }

  private draw(x: number, y: number, moving: boolean) {
    const canvasCtx = this.canvasCtx;
    if (moving && canvasCtx) {
      canvasCtx.strokeStyle = this.brushColor;
      canvasCtx.lineWidth = this.brushSize;
      canvasCtx.lineJoin = 'round';
      canvasCtx.filter = 'blur(0.35px)';
      canvasCtx.miterLimit;
      canvasCtx.beginPath();
      canvasCtx.globalCompositeOperation = 'source-over';
      canvasCtx.moveTo(this.lastX, this.lastY - HEADER_HEIGHT_OFFSET_px);
      canvasCtx.lineTo(x, y - HEADER_HEIGHT_OFFSET_px);
      canvasCtx.closePath();
      canvasCtx.stroke();
    }
    this.lastX = x;
    this.lastY = y;
  }
}
