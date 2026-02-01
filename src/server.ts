import Fastify from 'fastify';
import { createMarket, getMarket, filterMarkets } from './store/marketStore';
import { validateCreateMarket, CreateMarketInput } from './validation/market';
import { Sport, MarketStatus } from './models/market';

const server = Fastify({
  logger: true
});

// Health endpoint
server.get('/health', async () => {
  return { status: 'ok' };
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

start();
