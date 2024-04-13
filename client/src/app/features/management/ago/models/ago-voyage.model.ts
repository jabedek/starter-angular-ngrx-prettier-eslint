import { VoyageIntensityPhase } from './ago-intensity.model';
import { VoyagePoint } from './ago-point.model';

/**
 * "Life" voyage - some longer process/venture in user's past that he undertook or encountered
 */
export interface Voyage {
  id: string;
  display: VoyageDisplay;
  name: string;
  finished: boolean;
  voyagePoints: VoyagePoint[];
  causedByEventId?: 'LOST' | string;
  intensityPhases?: VoyageIntensityPhase[];
}

export interface VoyageDisplay {
  img?: string;
  color: string;
  slotIndex: number;
}
