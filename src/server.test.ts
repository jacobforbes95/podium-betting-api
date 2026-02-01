import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { server } from './server';

beforeAll(async () => {
  await server.ready();
});

afterAll(async () => {
  await server.close();
});

describe('GET /health', () => {
  it('returns ok status', async () => {
    const response = await request(server.server)
      .get('/health')
      .expect(200);

    expect(response.body).toEqual({ status: 'ok' });
  });
});

describe('POST /markets', () => {
  it('creates a market with valid input', async () => {
    const response = await request(server.server)
      .post('/markets')
      .send({
        sport: 'football',
        eventId: 'evt_test_1',
        odds: { home: 1.5, away: 2.5 },
      })
      .expect(201);

    expect(response.body).toMatchObject({
      sport: 'football',
      eventId: 'evt_test_1',
      status: 'open',
      odds: { home: 1.5, away: 2.5 },
    });
    expect(response.body.id).toBeDefined();
  });

  it('returns 400 for invalid input', async () => {
    const response = await request(server.server)
      .post('/markets')
      .send({
        sport: 'invalid_sport',
        eventId: '',
        odds: { home: 0.5 },
      })
      .expect(400);

    expect(response.body.errors).toBeDefined();
    expect(response.body.errors.length).toBeGreaterThan(0);
  });
});

describe('GET /markets', () => {
  it('returns list of markets', async () => {
    const response = await request(server.server)
      .get('/markets')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('filters by sport', async () => {
    await request(server.server)
      .post('/markets')
      .send({
        sport: 'tennis',
        eventId: 'evt_tennis_1',
        odds: { player1: 1.8, player2: 2.0 },
      });

    const response = await request(server.server)
      .get('/markets?sport=tennis')
      .expect(200);

    expect(response.body.every((m: { sport: string }) => m.sport === 'tennis')).toBe(true);
  });
});

describe('GET /markets/:id', () => {
  it('returns a market by id', async () => {
    const createResponse = await request(server.server)
      .post('/markets')
      .send({
        sport: 'basketball',
        eventId: 'evt_basket_1',
        odds: { team1: 1.6, team2: 2.2 },
      });

    const response = await request(server.server)
      .get(`/markets/${createResponse.body.id}`)
      .expect(200);

    expect(response.body.id).toBe(createResponse.body.id);
  });

  it('returns 404 for non-existent market', async () => {
    const response = await request(server.server)
      .get('/markets/mkt_nonexistent')
      .expect(404);

    expect(response.body.error).toBe('Market not found');
  });
});

describe('POST /markets/:id/odds', () => {
  it('updates odds for a market', async () => {
    const createResponse = await request(server.server)
      .post('/markets')
      .send({
        sport: 'football',
        eventId: 'evt_odds_update',
        odds: { home: 1.5, away: 2.5 },
      });

    const response = await request(server.server)
      .post(`/markets/${createResponse.body.id}/odds`)
      .send({
        odds: { home: 1.8, away: 2.2 },
      })
      .expect(200);

    expect(response.body.odds).toEqual({ home: 1.8, away: 2.2 });
  });

  it('returns 400 for invalid odds', async () => {
    const createResponse = await request(server.server)
      .post('/markets')
      .send({
        sport: 'football',
        eventId: 'evt_invalid_odds',
        odds: { home: 1.5, away: 2.5 },
      });

    const response = await request(server.server)
      .post(`/markets/${createResponse.body.id}/odds`)
      .send({
        odds: { home: 0.5 },
      })
      .expect(400);

    expect(response.body.errors).toBeDefined();
  });

  it('returns 404 for non-existent market', async () => {
    const response = await request(server.server)
      .post('/markets/mkt_nonexistent/odds')
      .send({
        odds: { home: 1.8, away: 2.2 },
      })
      .expect(404);

    expect(response.body.error).toBe('Market not found');
  });
});
