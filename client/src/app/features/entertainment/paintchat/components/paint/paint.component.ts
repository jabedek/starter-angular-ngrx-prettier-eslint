import { AfterContentChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { AppCheckboxEvent } from '@shared/components/controls/checkbox/checkbox.component';

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

  get canvasCtx() {
    const canvas = this.canvasEl?.nativeElement;
    return { canvas, ctx: canvas ? canvas.getContext('2d') : undefined };
  }

  @ViewChild('canvasElBg') set canvasElBg(canvasElBg: ElementRef<HTMLCanvasElement> | undefined) {
    this._canvasElBg = canvasElBg;
  }
  get canvasElBg(): ElementRef<HTMLCanvasElement> | undefined {
    return this._canvasElBg;
  }
  private _canvasElBg: ElementRef<HTMLCanvasElement> | undefined = undefined;

  get canvasBgCtx() {
    const canvas = this.canvasElBg?.nativeElement;
    return { canvas, ctx: canvas ? canvas.getContext('2d') : undefined };
  }

  @ViewChild('viewportEl') set viewportEl(viewportEl: ElementRef<HTMLDivElement> | undefined) {
    this._viewportEl = viewportEl;
  }
  get viewportEl(): ElementRef<HTMLDivElement> | undefined {
    return this._viewportEl;
  }
  private _viewportEl: ElementRef<HTMLDivElement> | undefined = undefined;

  // constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    const { canvas } = this.canvasCtx;
    const { canvas: canvasBg } = this.canvasBgCtx;
    if (canvas && canvasBg) {
      this.canvasResize();
      window.onresize = this.canvasResize;
    }
  }

  stackCanvasImages(bottom: HTMLCanvasElement, top: HTMLCanvasElement): HTMLCanvasElement {
    // 1. copy 'bottom' and 'topCanvas' to new canvas
    const bottomCopy = document.createElement('canvas');
    bottomCopy.width = bottom.width;
    bottomCopy.height = bottom.height;

    const topCopy = document.createElement('canvas');
    topCopy.width = top.width;
    topCopy.height = top.height;

    // 2. draw 'bottom' and 'top' to new canvas
    const ctxBottom = bottomCopy.getContext('2d');
    const ctxTop = topCopy.getContext('2d');
    if (ctxBottom && ctxTop) {
      ctxBottom.drawImage(bottom, 0, 0);
      ctxTop.drawImage(top, 0, 0);
    }

    // 3. stack 'bottom' and 'top' on new canvas
    const stackCanvas = document.createElement('canvas');
    stackCanvas.width = bottom.width;
    stackCanvas.height = bottom.height;
    const ctxStack = stackCanvas.getContext('2d');
    if (ctxStack) {
      ctxStack.drawImage(bottomCopy, 0, 0);
      ctxStack.drawImage(topCopy, 0, 0);
    }
    return stackCanvas;
  }

  downloadImg(): void {
    const { canvas, ctx } = this.canvasCtx;

    if (canvas && ctx) {
      const a = document.createElement('a');

      if (this.saveWithBg) {
        const { canvas: canvasBg, ctx: ctxBg } = this.canvasBgCtx;
        if (canvasBg && ctxBg) {
          const stackCanvas = this.stackCanvasImages(canvasBg, canvas);
          a.href = stackCanvas.toDataURL('image/png');
        }
      } else {
        ctx.globalCompositeOperation = 'source-over';
        a.href = canvas.toDataURL('image/png');
      }
      const name = new Date().toISOString().substring(0, 19).replaceAll('-', '').replaceAll(':', '').replace('T', '');
      a.download = `${name}.png`;
      a.click();
    }
  }

  clearArea(): void {
    const { ctx } = this.canvasCtx;
    if (ctx) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
  }

  private canvasResize(): void {
    const { canvas } = this.canvasCtx;
    if (canvas) {
      if (window.screen.width <= 600) {
        canvas.width = window.innerWidth;
        canvas.height = 0.65 * window.innerHeight;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = 500;
      }

      const { canvas: canvasBg, ctx: ctxBg } = this.canvasBgCtx;
      if (canvasBg && ctxBg) {
        canvasBg.width = canvas.width;
        canvasBg.height = canvas.height;
        ctxBg.fillStyle = '#444';
        ctxBg.fillRect(0, 0, canvasBg.width, canvasBg.height);
      }
    }
  }

  private draw(x: number, y: number, moving: boolean) {
    const { ctx } = this.canvasCtx;
    if (moving && ctx) {
      ctx.strokeStyle = this.brushColor;
      ctx.lineWidth = this.brushSize;
      ctx.lineJoin = 'round';
      ctx.filter = 'blur(0.35px)';
      ctx.miterLimit;
      ctx.beginPath();
      ctx.globalCompositeOperation = 'source-over';
      ctx.moveTo(this.lastX, this.lastY - HEADER_HEIGHT_OFFSET_px);
      ctx.lineTo(x, y - HEADER_HEIGHT_OFFSET_px);
      ctx.closePath();
      ctx.stroke();
    }
    this.lastX = x;
    this.lastY = y;
  }

  /** Drawing event handlers */
  handleMouseDownCanvas(e: MouseEvent) {
    const { canvas } = this.canvasCtx;
    this.mousePressed = true;
    if (canvas) {
      const { pageX, pageY } = e;
      const { offsetLeft, offsetTop } = canvas;
      this.draw(pageX - offsetLeft, pageY - offsetTop, false);
    }
  }

  handleMouseMoveCanvas(e: MouseEvent) {
    const { canvas } = this.canvasCtx;
    if (canvas) {
      const { pageX, pageY } = e;
      const { offsetLeft, offsetTop } = canvas;
      if (this.mousePressed) {
        this.draw(pageX - offsetLeft, pageY - offsetTop, true);
      }
    }
  }

  handleTouchStartCanvas(e: TouchEvent) {
    const { canvas } = this.canvasCtx;
    if (canvas) {
      this.mousePressed = true;
      const target = e.touches[0];
      const newEvent = new MouseEvent('mousedown', { clientX: target.clientX, clientY: target.clientY });
      canvas.dispatchEvent(newEvent);
    }
  }

  handleTouchMoveCanvas(e: TouchEvent) {
    const { canvas } = this.canvasCtx;
    if (canvas) {
      const target = e.touches[0];
      const newEvent = new MouseEvent('mousemove', { clientX: target.clientX, clientY: target.clientY });
      canvas.dispatchEvent(newEvent);
    }
  }
}
