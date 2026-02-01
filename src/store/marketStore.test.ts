import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMarket, getMarket, filterMarkets, updateOdds } from './marketStore';
import { Sport, MarketStatus } from '../models/market';
import { on, off, clear } from '../events/eventBus';
import { ODDS_CHANGED, OddsChangedEvent } from '../events/marketEvents';

describe('marketStore', () => {
  it('creates a market with correct properties', () => {
    const market = createMarket(Sport.Football, 'evt_123', { home: 1.5, away: 2.5 });

    expect(market.id).toMatch(/^mkt_\d+$/);
    expect(market.sport).toBe(Sport.Football);
    expect(market.eventId).toBe('evt_123');
    expect(market.status).toBe(MarketStatus.Open);
    expect(market.odds).toEqual({ home: 1.5, away: 2.5 });
    expect(market.updatedAt).toBeInstanceOf(Date);
  });

  it('retrieves a market by id', () => {
    const created = createMarket(Sport.Tennis, 'evt_456', { player1: 1.8, player2: 2.0 });
    const retrieved = getMarket(created.id);

    expect(retrieved).toEqual(created);
  });

  it('returns undefined for non-existent market', () => {
    const retrieved = getMarket('mkt_nonexistent');
    expect(retrieved).toBeUndefined();
  });

  it('lists all markets when no filters provided', () => {
    const initialCount = filterMarkets({}).length;
    createMarket(Sport.Basketball, 'evt_789', { team1: 1.6, team2: 2.2 });

    const markets = filterMarkets({});
    expect(markets.length).toBe(initialCount + 1);
  });
});

describe('filterMarkets', () => {

  it('filters by sport', () => {
    createMarket(Sport.Horse_Racing, 'evt_hr_1', { horse1: 3.0, horse2: 2.5 });
    const filtered = filterMarkets({ sport: Sport.Horse_Racing });

    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every(m => m.sport === Sport.Horse_Racing)).toBe(true);
  });

  it('filters by status', () => {
    const filtered = filterMarkets({ status: MarketStatus.Open });

    expect(filtered.every(m => m.status === MarketStatus.Open)).toBe(true);
  });

  it('filters by both sport and status', () => {
    createMarket(Sport.Tennis, 'evt_t_filter', { p1: 1.9, p2: 2.1 });
    const filtered = filterMarkets({ sport: Sport.Tennis, status: MarketStatus.Open });

    expect(filtered.every(m => m.sport === Sport.Tennis && m.status === MarketStatus.Open)).toBe(true);
  });
});

describe('updateOdds', () => {
  beforeEach(() => {
    clear();
  });

  it('updates odds and updatedAt', () => {
    const market = createMarket(Sport.Football, 'evt_odds_1', { home: 1.5, away: 2.5 });
    const originalUpdatedAt = market.updatedAt;

    const updated = updateOdds(market.id, { home: 1.8, away: 2.2 });

    expect(updated).toBeDefined();
    expect(updated!.odds).toEqual({ home: 1.8, away: 2.2 });
    expect(updated!.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
  });

  it('returns undefined for non-existent market', () => {
    const result = updateOdds('mkt_nonexistent', { home: 1.5, away: 2.5 });
    expect(result).toBeUndefined();
  });

  it('emits odds_changed event', () => {
    const market = createMarket(Sport.Football, 'evt_odds_2', { home: 1.5, away: 2.5 });
    const handler = vi.fn();

    on<OddsChangedEvent>(ODDS_CHANGED, handler);
    updateOdds(market.id, { home: 1.8, away: 2.2 });
    off<OddsChangedEvent>(ODDS_CHANGED, handler);

    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        marketId: market.id,
        previousOdds: { home: 1.5, away: 2.5 },
        newOdds: { home: 1.8, away: 2.2 },
      })
    );
  });
});

