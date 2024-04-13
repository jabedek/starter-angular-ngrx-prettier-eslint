import { CellPos } from './ago-point.model';

export interface VoyageIntensityPhase {
  level: VoyageIntensityLevel;
  pos: CellPos;
}

export enum VoyageIntensityLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  HYPER = 'HYPER',
}
