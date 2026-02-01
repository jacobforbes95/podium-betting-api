import Fastify from 'fastify';
import { createMarket, getMarket, filterMarkets, updateOdds } from './store/marketStore';
import { validateCreateMarket, CreateMarketInput, validateUpdateOdds, UpdateOddsInput } from './validation/market';
import { Sport, MarketStatus } from './models/market';
import { on, off } from './events/eventBus';
import { ODDS_CHANGED, OddsChangedEvent } from './events/marketEvents';

const server = Fastify({
  logger: true
});

// Health endpoint
server.get('/health', async () => {
  return { status: 'ok' };
});

// SSE endpoint for odds_changed events
server.get('/events/odds', (request, reply) => {
  reply.raw.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  const handler = (event: OddsChangedEvent) => {
    reply.raw.write(`data: ${JSON.stringify(event)}\n\n`);
  };

  on<OddsChangedEvent>(ODDS_CHANGED, handler);

  request.raw.on('close', () => {
    off<OddsChangedEvent>(ODDS_CHANGED, handler);
  });
});

// List markets endpoint with optional filters
server.get('/markets', async (request) => {
  const { sport, status } = request.query as { sport?: string; status?: string };

  const filters: { sport?: Sport; status?: MarketStatus } = {};

  if (sport && Object.values(Sport).includes(sport as Sport)) {
    filters.sport = sport as Sport;
  }
  if (status && Object.values(MarketStatus).includes(status as MarketStatus)) {
    filters.status = status as MarketStatus;
  }

  return filterMarkets(filters);
});

// Create market endpoint
server.post('/markets', async (request, reply) => {
  const input = request.body as CreateMarketInput;

  const errors = validateCreateMarket(input);
  if (errors.length > 0) {
    return reply.status(400).send({ errors });
  }

  const market = createMarket(input.sport as Sport, input.eventId, input.odds as Record<string, number>);
  return reply.status(201).send(market);
});

// Get market by ID endpoint
server.get('/markets/:id', async (request, reply) => {
  const { id } = request.params as { id: string };
  const market = getMarket(id);

  if (!market) {
    return reply.status(404).send({ error: 'Market not found' });
  }

  return market;
});

// Update market odds endpoint
server.post('/markets/:id/odds', async (request, reply) => {
  const { id } = request.params as { id: string };
  const input = request.body as UpdateOddsInput;

  const errors = validateUpdateOdds(input);
  if (errors.length > 0) {
    return reply.status(400).send({ errors });
  }

  const market = updateOdds(id, input.odds as Record<string, number>);
  if (!market) {
    return reply.status(404).send({ error: 'Market not found' });
  }

  return market;
});

export { server };

const start = async () => {
  const port = Number(process.env.PORT) || 3000;
  const host = process.env.HOST || '0.0.0.0';

  try {
    await server.listen({ port, host });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

if (require.main === module) {
  start();
}
