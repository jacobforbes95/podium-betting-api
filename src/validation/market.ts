import { Sport } from '../models/market';

export interface CreateMarketInput {
  sport: string;
  eventId: string;
  odds: Record<string, unknown>;
}

export interface ValidationError {
  field: string;
  message: string;
}

export function validateCreateMarket(input: CreateMarketInput): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate sport
  if (!input.sport) {
    errors.push({ field: 'sport', message: 'Sport is required' });
  } else if (!Object.values(Sport).includes(input.sport as Sport)) {
    errors.push({ field: 'sport', message: `Invalid sport. Must be one of: ${Object.values(Sport).join(', ')}` });
  }

  // Validate eventId
  if (!input.eventId || input.eventId.trim() === '') {
    errors.push({ field: 'eventId', message: 'Event ID is required' });
  }

  // Validate odds
  if (!input.odds || typeof input.odds !== 'object') {
    errors.push({ field: 'odds', message: 'Odds are required' });
  } else {
    const selections = Object.keys(input.odds);
    if (selections.length < 2) {
      errors.push({ field: 'odds', message: 'At least two selections are required' });
    }
    for (const [selection, value] of Object.entries(input.odds)) {
      if (typeof value !== 'number' || value <= 1) {
        errors.push({ field: `odds.${selection}`, message: 'Odds must be a number greater than 1' });
      }
    }
  }

  return errors;
}
