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

export function listMarkets(): Market[] {
  return Array.from(markets.values());
}
