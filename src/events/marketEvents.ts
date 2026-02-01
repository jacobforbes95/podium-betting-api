import { Odds } from '../models/market';

export interface OddsChangedEvent {
  marketId: string;
  previousOdds: Odds;
  newOdds: Odds;
  updatedAt: Date;
}

export const ODDS_CHANGED = 'odds_changed';
