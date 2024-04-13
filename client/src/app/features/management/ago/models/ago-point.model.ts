import { VoyageIntensityLevel } from './ago-intensity.model';

export interface VoyagePoint {
  id: string;
  type: VoyagePointType;
  date: Date;
  message: string;
  pos: CellPos;
  forkedEventId?: string;
  display?: VoyagePointDisplay;
}

export enum VoyagePointType {
  START = 'START',
  NOTE = 'NOTE',
  FORK = 'FORK', // FORK means this event was a reason to some new event, specified by VoyagePoint#forkedEventId
  END = 'END',
}

export enum ActiveCellLineStage {
  START = 'start',
  DURING = 'during',
  END = 'end',
}

/**
 * Used to identify VoyagePoint on calendar's specific slot
 * year_month_week__slot
 * 'N' - indicates that month number is natural - 1 === january etc
 * 'W' - week of a month
 * 'S' - indicated that it means y-axis === slot, not day
 */
export type CellPos = `${number}_N${string}_W${string}_S${string}` | `${number}_N${string}`;

/**
 * Used to identify cells within same row / column.
 */
export type VoyagePointNoteSize = 'normal' | 'big';

export interface VoyagePointDisplay {
  img?: string;
  size?: VoyagePointNoteSize;
}

export interface ActiveCell {
  voyageId: string;
  pos: CellPos;
  point: boolean;
  cellDisplay: {
    color: string;
    lineStage: ActiveCellLineStage;
    pointImg?: string;
    pointSize?: VoyagePointNoteSize;
    lineIntensity?: VoyageIntensityLevel;
  };
  forkedFromId?: string;
  forkedToId?: string;
}
