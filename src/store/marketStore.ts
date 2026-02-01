import { Market, MarketStatus, Sport, Odds } from '../models/market';

const markets = new Map<string, Market>();

let idCounter = 1;

function generateId(): string {
  return `mkt_${idCounter++}`;
}

export function createMarket(sport: Sport, eventId: string, odds: Odds): Market {
  const id = generateId();
  const market: Market = {
    id,
    sport,
    eventId,
    status: MarketStatus.Open,
    odds,
    updatedAt: new Date(),
  };
  markets.set(id, market);
  return market;
}

export function getMarket(id: string): Market | undefined {
  return markets.get(id);
}


export interface MarketFilters {
  sport?: Sport;
  status?: MarketStatus;
}

export function filterMarkets(filters: MarketFilters): Market[] {
  let result = Array.from(markets.values());

  if (filters.sport) {
    result = result.filter(m => m.sport === filters.sport);
  }
  if (filters.status) {
    result = result.filter(m => m.status === filters.status);
  }

  return result;
}

