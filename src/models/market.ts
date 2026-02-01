export enum Sport {
  Football = 'football',
  Tennis = 'tennis',
  Basketball = 'basketball',
  Horse_Racing = 'horse_racing',
}

export enum MarketStatus {
  Open = 'open',
  Suspended = 'suspended',
  Closed = 'closed',
}

export interface Odds {
  [selection: string]: number;
}

export interface Market {
  id: string;
  sport: Sport;
  eventId: string;
  status: MarketStatus;
  odds: Odds;
  updatedAt: Date;
}
