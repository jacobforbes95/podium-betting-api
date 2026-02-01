import { describe, it, expect } from 'vitest';
import { validateCreateMarket } from './market';

describe('validateCreateMarket', () => {
  it('returns no errors for valid input', () => {
    const input = {
      sport: 'football',
      eventId: 'evt_123',
      odds: { home: 1.5, away: 2.5 },
    };
    const errors = validateCreateMarket(input);
    expect(errors).toEqual([]);
  });

  it('returns error when sport is missing', () => {
    const input = {
      sport: '',
      eventId: 'evt_123',
      odds: { home: 1.5, away: 2.5 },
    };
    const errors = validateCreateMarket(input);
    expect(errors).toContainEqual({ field: 'sport', message: 'Sport is required' });
  });

  it('returns error for invalid sport', () => {
    const input = {
      sport: 'cricket',
      eventId: 'evt_123',
      odds: { home: 1.5, away: 2.5 },
    };
    const errors = validateCreateMarket(input);
    expect(errors[0].field).toBe('sport');
    expect(errors[0].message).toContain('Invalid sport');
  });

  it('returns error when eventId is missing', () => {
    const input = {
      sport: 'football',
      eventId: '',
      odds: { home: 1.5, away: 2.5 },
    };
    const errors = validateCreateMarket(input);
    expect(errors).toContainEqual({ field: 'eventId', message: 'Event ID is required' });
  });

  it('returns error when odds has fewer than 2 selections', () => {
    const input = {
      sport: 'football',
      eventId: 'evt_123',
      odds: { home: 1.5 },
    };
    const errors = validateCreateMarket(input);
    expect(errors).toContainEqual({ field: 'odds', message: 'At least two selections are required' });
  });

  it('returns error when odds value is not greater than 1', () => {
    const input = {
      sport: 'football',
      eventId: 'evt_123',
      odds: { home: 1.0, away: 2.5 },
    };
    const errors = validateCreateMarket(input);
    expect(errors).toContainEqual({ field: 'odds.home', message: 'Odds must be a number greater than 1' });
  });
});
