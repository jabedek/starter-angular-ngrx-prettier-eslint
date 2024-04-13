import { Injectable } from '@angular/core';
import { differenceInCalendarMonths, addMonths } from 'date-fns';
import { Voyage, VoyagePointType } from '../models';
import { FutureMonths } from '../models/ago-calendar.model';
import { DurationRange } from '../models/ago-commons.model';
import { CellPos, ActiveCell, ActiveCellLineStage } from '../models/ago-point.model';
import { getCellPos } from '../pipes/ago-pos.pipe';

@Injectable({
  providedIn: 'root',
})
export class AgoCellService {
  constructor() {}

  getVoyagesTotalDuration(voyages: Voyage[]): DurationRange {
    const latest = new Date().getFullYear();
    let earliest = new Date().getFullYear();

    voyages.forEach(({ voyagePoints }) =>
      voyagePoints.forEach(({ date }) => {
        const pointDate = date.getFullYear();
        if (pointDate < earliest) {
          earliest = pointDate;
        }
      }),
    );

    return { earliest, latest, length: latest - earliest + 1 };
  }

  // only months for now
  isCellBetweenMonthSlots(start: CellPos, end: CellPos, target: CellPos): boolean {
    const months = [start, end, target].map((s) => this.extractMonthFromPos(s));
    return months[1] >= months[0] && months[1] <= months[2];
  }

  transformDateToPos(date: Date, slotIndex: number): CellPos {
    const year = date.getFullYear();
    const month = date.getMonth();

    return getCellPos(year, month, slotIndex);
  }

  getPatchedSlotsBetween(from: CellPos, to: CellPos, omit: CellPos[]): CellPos[] {
    const [fromYear, fromMonth, fromWeek, fromSlot] = from.replace(/[^\d|^\_]/, '').split('_');
    const [toYear, toMonth, toWeek, toSlot] = to.replace(/[^\d|^\_]/, '').split('_');

    const fromDate = new Date(`${fromYear}-${fromMonth}-01`);
    const toDate = new Date(`${toYear}-${toMonth}-01`);
    const coveredDates: CellPos[] = [];

    for (let month = 0; month < Math.abs(differenceInCalendarMonths(fromDate, toDate)) + 1; month++) {
      const date = addMonths(new Date(fromYear), month);
      const newPos: CellPos = getCellPos(date.getFullYear(), date.getMonth(), Number(fromSlot.substring(1, 3)));

      if (!omit.includes(newPos)) {
        coveredDates.push(newPos);
      }
    }

    return coveredDates;
  }

  extractMonthFromPos(pos: CellPos): number {
    return Number(pos.substring(6, 8));
  }

  isCellInsideVoyage(
    targetPos: CellPos,
    activeCells: ActiveCell[],
  ): { voyageStart: ActiveCell | undefined; voyageEnd: ActiveCell | undefined } {
    console.log(targetPos);

    let voyageStart: ActiveCell | undefined;
    let voyageEnd: ActiveCell | undefined;
    activeCells.forEach((c) => {
      const { cellDisplay, pos } = c;
      console.log(c);

      const targetDate = new Date(`${targetPos.substring(0, 4)}-${targetPos.substring(6, 8)}`).getTime();
      const posDate = new Date(`${pos.substring(0, 4)}-${pos.substring(6, 8)}`).getTime();

      if (cellDisplay.lineStage === ActiveCellLineStage.START && posDate < targetDate) {
        voyageStart = c;
      }

      if (voyageStart && cellDisplay.lineStage === ActiveCellLineStage.END && posDate > targetDate) {
        voyageEnd = c;
      }
      console.log(voyageStart, voyageEnd);
    });

    return { voyageStart, voyageEnd };
  }

  getFutureMonthsCurrentYr(): FutureMonths {
    const tillLastMonth = new Date(`${new Date().getFullYear()}-${new Date().getMonth()}-01`);
    const toCurrentMonth = 1; // set to 0 if only completed monhts
    const fromDate = addMonths(new Date(tillLastMonth), 1 + toCurrentMonth);
    const lastMonth = new Date(`${new Date().getFullYear()}-12-01`);
    const diff = Math.abs(differenceInCalendarMonths(tillLastMonth, lastMonth));
    const positions: Map<CellPos, CellPos> = new Map();
    const naturalNumbers: Map<number, number> = new Map();

    for (let month = 0; month < diff; month++) {
      const date = addMonths(fromDate, month);
      const newPos: CellPos = getCellPos(date.getFullYear(), date.getMonth());

      naturalNumbers.set(date.getMonth() + 1, date.getMonth() + 1);
      positions.set(newPos, newPos);
    }

    const [firstPos] = positions.keys();

    return { firstPos, positions, naturalNumbers };
  }

  getActiveCellsInRow(pos: CellPos, activeCells: Map<CellPos, ActiveCell>): ActiveCell[] {
    const activeCellsInRow: ActiveCell[] = [];
    activeCells.forEach((c) => {
      if (c.pos.substring(13, 16) === pos.substring(13, 16)) {
        activeCellsInRow.push(c);
      }
    });

    return activeCellsInRow;
  }

  mapVoyageToActiveCells(voyage: Voyage): Map<CellPos, ActiveCell> {
    const map: Map<CellPos, ActiveCell> = new Map();
    const today = new Date();
    const toCurrentMonth = 1; // set to 0 if only completed monhts
    const todayMinusMonth = new Date(`${today.getFullYear()}-${today.getMonth() + toCurrentMonth}-01`);

    const defaultDate = this.transformDateToPos(todayMinusMonth, voyage.display.slotIndex);
    let start: CellPos = defaultDate;
    let end: CellPos = defaultDate;
    const allPoints: CellPos[] = [];

    // ## 1. add Voyage Points
    voyage.voyagePoints.forEach((p) => {
      let lineStage: ActiveCellLineStage = ActiveCellLineStage.DURING;
      if (p.type === VoyagePointType.START) {
        start = p.pos;
        lineStage = ActiveCellLineStage.START;
      }

      if (p.type === VoyagePointType.END) {
        end = p.pos;
        lineStage = ActiveCellLineStage.END;
      }

      allPoints.push(p.pos);

      const ac: ActiveCell = {
        voyageId: voyage.id,
        pos: p.pos,
        point: true,
        cellDisplay: {
          color: voyage.display.color,
          pointImg: p.display?.img,
          pointSize: p.display?.size,
          lineIntensity: voyage.intensityPhases?.find((i) => i.pos === p.pos)?.level,
          lineStage,
        },
      };

      map.set(p.pos, ac);
    });

    // ## 2. determine and add Voyage Lines
    const slotsBetween = this.getPatchedSlotsBetween(start, end, allPoints);
    slotsBetween.forEach((s) => {
      let lineStage = ActiveCellLineStage.DURING;
      if (s === start) {
        lineStage = ActiveCellLineStage.START;
      }

      if (s === end) {
        lineStage = ActiveCellLineStage.END;
      }

      const ac: ActiveCell = {
        voyageId: voyage.id,
        pos: s,
        point: false,
        cellDisplay: {
          color: voyage.display.color,
          lineStage,
        },
      };

      map.set(s, ac);
    });

    return map;
  }
}
