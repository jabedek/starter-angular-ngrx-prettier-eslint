import { AfterViewChecked, Component, ElementRef, OnInit, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { TimeMode, Voyage } from '../../models';
import { TableCellElements, FutureMonths } from '../../models/ago-calendar.model';
import { Direction } from '../../models/ago-commons.model';
import { CellPos, ActiveCell, ActiveCellLineStage } from '../../models/ago-point.model';
import { AgoCellService } from '../../services/ago-cell.service';
import { AgoDateService } from '../../services/ago-date.service';
import { agoUser } from '../../ago-mock';

@Component({
  selector: 'app-ago-calendar',
  templateUrl: './ago-calendar.component.html',
  styleUrls: ['./ago-calendar.component.scss'],
})
export class AgoCalendarComponent implements OnInit, AfterViewChecked {
  @ViewChildren('monthDataCell') monthDataCells: QueryList<any> | undefined;
  @ViewChildren('monthHeaderCell') monthHeaderCells: QueryList<any> | undefined;
  cellsElements: TableCellElements = {
    header: [],
    data: [],
  };
  cellsElementsHighlighted: TableCellElements = {
    header: [],
    data: [],
  };

  users = [agoUser];
  timeMode: TimeMode = 'years';
  years: number[] = [];
  voyageAxisSlots = Array(25);
  months = this.dateService.getAllMonthNames();
  rendererInstance: any;

  futureCellsPositions: FutureMonths | undefined;
  activeCells: Map<CellPos, ActiveCell> = new Map();

  constructor(
    private renderer: Renderer2,
    private cellService: AgoCellService,
    private dateService: AgoDateService,
  ) {}

  ngOnInit(): void {
    const range = this.cellService.getVoyagesTotalDuration(this.users[0].voyages);
    this.years = this.dateService.getYearsFromRange(range);
    this.activeCells = this.mapVoyagesIntoActiveCells();
    this.futureCellsPositions = this.cellService.getFutureMonthsCurrentYr();
  }

  ngAfterViewChecked(): void {
    if (this.monthDataCells && this.monthHeaderCells) {
      this.cellsElements.header = this.monthHeaderCells?.toArray() || [];
      this.cellsElements.data = this.monthDataCells?.toArray() || [];
    }
  }

  mapVoyagesIntoActiveCells(): Map<CellPos, ActiveCell> {
    let map: Map<CellPos, ActiveCell> = new Map();
    this.users.forEach(({ voyages }) =>
      voyages.forEach((v: Voyage) => (map = new Map([...map, ...this.cellService.mapVoyageToActiveCells(v)]))),
    );
    return map;
  }

  handleMouseEnter(event: MouseEvent) {
    const targetAttr = ((event.currentTarget as HTMLDivElement).attributes.getNamedItem('month-cell')?.textContent ||
      '') as CellPos;
    this.toggleCellsHighlight(this.getCellsRefsBy(targetAttr, 'column'), 'vertical');
  }

  handleClick(pos: CellPos, event?: any) {
    const newPos = (pos as unknown as string).split('_');

    if (!this.futureCellsPositions?.positions.get(pos.substring(0, 8))) {
      const activeCellsInRow = this.cellService.getActiveCellsInRow(pos, this.activeCells);

      let cellIsPartOfVoyage = false;
      let pointAlreadyExistsInSlot = false;

      activeCellsInRow.forEach((c) => {
        const cellPos = c.pos.split('_');

        if (newPos[0] === cellPos[0] && newPos[1] === cellPos[1]) {
          cellIsPartOfVoyage = true;
          pointAlreadyExistsInSlot = !!c.point;
        }
      });

      if (!pointAlreadyExistsInSlot) {
        const { voyageStart, voyageEnd } = this.cellService.isCellInsideVoyage(pos, activeCellsInRow);

        const activeCell: ActiveCell = {
          voyageId: '',
          pos,
          point: true,
          cellDisplay: {
            color: 'gray',
            lineStage: ActiveCellLineStage.DURING,
          },
        };

        if (voyageStart) {
          activeCell.cellDisplay.color = voyageStart.cellDisplay.color;
          activeCell.voyageId = voyageStart.voyageId;
          activeCell.cellDisplay.lineStage = ActiveCellLineStage.DURING;

          if (!voyageEnd && !cellIsPartOfVoyage) {
            activeCell.cellDisplay.color = 'gray';
            activeCell.cellDisplay.lineStage = ActiveCellLineStage.START;
          }
        }

        this.activeCells.set(pos, activeCell);
      }

      if (!cellIsPartOfVoyage) {
        this.activeCells.set(pos, {
          voyageId: '',
          pos,
          point: true,
          cellDisplay: {
            color: 'yellow',
            lineStage: ActiveCellLineStage.START,
          },
        });
      }
    }
  }

  private getCellsRefsBy(targetAttr: CellPos, from: 'column' | 'row', dataCellsOnly = false): TableCellElements {
    const partFrom = from === 'column' ? 0 : 13;
    const partTo = from === 'column' ? 8 : 16;
    const filterFn = (el: ElementRef<HTMLDivElement>) =>
      el.nativeElement.attributes.getNamedItem('month-cell')?.textContent?.substring(partFrom, partTo) ===
      targetAttr.substring(partFrom, partTo);

    return {
      header: [...(dataCellsOnly ? [] : this.cellsElements.header.filter(filterFn))],
      data: [...this.cellsElements.data.filter(filterFn)],
    } as TableCellElements;
  }

  private toggleCellsHighlight(elements: TableCellElements, by: Direction, hideOthers = true) {
    if (hideOthers) {
      this.setHighlight('hide', this.cellsElementsHighlighted);
    }

    this.setHighlight('show', elements);
  }

  private setHighlight(action: 'show' | 'hide', elements: TableCellElements) {
    const forEachFn = (el: ElementRef<HTMLDivElement>) =>
      action === 'show'
        ? this.renderer.addClass(el.nativeElement, `highlighted`)
        : this.renderer.removeClass(el.nativeElement, `highlighted`);

    elements.header.forEach(forEachFn);
    elements.data.forEach(forEachFn);

    this.cellsElementsHighlighted = elements;
  }
}
