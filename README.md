# Podium Betting API

A minimal Fastify server in TypeScript demonstrating core betting market functionality: creating markets, retrieving them, updating odds in real-time, and streaming changes via Server-Sent Events.

## Setup and Run

```bash
# Install dependencies
npm install

# Run tests
npm test

# Development (with ts-node)
npm run dev

# Production build
npm run build
npm start
```

The server runs on `http://localhost:3000` by default. Configure via environment variables:
- `PORT` - Server port (default: 3000)
- `HOST` - Server host (default: 0.0.0.0)

## Architecture

The API follows a simple layered structure: HTTP handlers in `server.ts` delegate to a `marketStore` for data operations and emit domain events via an `eventBus`. This separation keeps the codebase organised while avoiding unnecessary abstractions. The store uses an in-memory Map for fast key-based lookups, and the event bus enables loose coupling between odds updates and SSE streaming.

Real-time updates are delivered using Server-Sent Events (SSE), chosen over WebSockets for simplicity—SSE requires no additional protocol handling and works well for server-to-client streaming. When odds change, the store emits an `odds_changed` event that SSE handlers forward to connected clients.

## Endpoints

| Method | Path                | Description                          |
|--------|---------------------|--------------------------------------|
| GET    | `/health`           | Health check                         |
| GET    | `/events/odds`      | SSE stream for odds changes          |
| GET    | `/markets`          | List markets (optional `?sport=` `?status=` filters) |
| POST   | `/markets`          | Create a new market                  |
| GET    | `/markets/:id`      | Get a market by ID                   |
| POST   | `/markets/:id/odds` | Update market odds                   |

### Example: Create a Market

```bash
curl -X POST http://localhost:3000/markets \
  -H "Content-Type: application/json" \
  -d '{"sport":"football","eventId":"evt_123","odds":{"home":1.5,"away":2.5}}'
```

### Example: Subscribe to Odds Changes

```bash
curl -N http://localhost:3000/events/odds
```

## Key Technical Decisions

- **Fastify over Express** — Built-in JSON parsing, better TypeScript support, and superior performance benchmarks.
- **In-memory Map for storage** — O(1) lookups by ID; simple and sufficient for demonstrating core flows.
- **Simple event bus** — Decouples odds updates from SSE delivery without adding external dependencies.
- **SSE over WebSockets** — Simpler implementation for unidirectional server-to-client streaming; no handshake or framing complexity.
- **Manual validation** — Keeps dependencies minimal; a production system might use a schema library like Zod or Ajv.
- **No authentication** — Out of scope; focus is on core betting operations.

## Assumptions

- Markets are uniquely identified by auto-generated IDs (`mkt_1`, `mkt_2`, etc.).
- Odds must have at least 2 selections, each with a value greater than 1.
- All data is ephemeral—lost on server restart by design.
- Single server instance; no horizontal scaling required for this demonstration.
- Clients consuming SSE are trusted and limited in number.

## Scaling Considerations

This implementation is intentionally minimal. For production during peak betting periods (e.g., major sporting events), the following changes would be necessary:

### Storage
- **Replace in-memory Map with Redis or a database** — Enables horizontal scaling across multiple server instances and provides persistence.
- **Use UUID or distributed ID generation** — The current sequential counter would conflict across instances.

### Real-time Events
- **Replace in-process event bus with Redis Pub/Sub or a message broker (e.g., Kafka)** — Allows events to propagate across all server instances, ensuring all SSE clients receive updates regardless of which instance processed the odds change.
- **Consider WebSocket with a library like Socket.IO** — Provides built-in reconnection, rooms for selective broadcasting (e.g., per-sport), and better scalability tooling.

### Performance
- **Add rate limiting** — Protect against abuse during high-traffic periods.
- **Implement caching** — Cache market lists with short TTLs to reduce repeated filtering operations.
- **Index markets by sport/status** — Replace O(n) filtering with indexed lookups for faster queries.
- **Connection limits on SSE** — Prevent memory exhaustion from too many open connections.

### Infrastructure
- **Load balancer with sticky sessions or shared state** — Required if SSE connections need to span multiple instances.
- **Health checks and graceful shutdown** — Already has `/health`; would add readiness probes and connection draining.
- **Monitoring and alerting** — Track request latency, error rates, and SSE connection counts.

## Project Structure

```
src/
├── server.ts              # HTTP endpoints and SSE handler
├── models/
│   └── market.ts          # Market, Sport, Odds types
├── store/
│   └── marketStore.ts     # In-memory storage and operations
├── validation/
│   └── market.ts          # Input validation functions
└── events/
    ├── eventBus.ts        # Simple pub/sub event emitter
    └── marketEvents.ts    # Domain event types
```

## Testing

```bash
npm test
```

Tests cover:
- **Validation** — Market creation and odds update input validation
- **Store** — CRUD operations and filtering logic
- **Events** — `odds_changed` event emission on odds updates
- **API** — Integration tests for all endpoints using supertest

## AI Workflow

This project was developed using AI-assisted tooling. See [AI.md](AI.md) for details on how AI was used, example prompts, and the judgement applied to generated code.

