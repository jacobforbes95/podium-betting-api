# Podium Betting API

A minimal Fastify server in TypeScript for a betting API.

## Getting Started

```bash
npm install
npm run dev    # Development with ts-node
npm run build  # Compile TypeScript
npm start      # Run compiled JS
```

## Endpoints

| Method | Path                | Description             |
|--------|---------------------|-------------------------|
| GET    | `/health`           | Health check endpoint   |
| GET    | `/markets`          | List markets (with optional filters) |
| POST   | `/markets`          | Create a new market     |
| GET    | `/markets/:id`      | Get a market by ID      |
| POST   | `/markets/:id/odds` | Update market odds      |

### GET /markets

Lists all markets with optional filtering.

**Query parameters:**
- `sport` (optional): Filter by sport (`football`, `tennis`, `basketball`, `horse_racing`)
- `status` (optional): Filter by status (`open`, `suspended`, `closed`)

**Examples:**
- `GET /markets` - List all markets
- `GET /markets?sport=football` - List football markets
- `GET /markets?status=open` - List open markets
- `GET /markets?sport=tennis&status=open` - List open tennis markets

**Response:** `200 OK` with an array of markets.

### POST /markets

Creates a new betting market.

**Request body:**
```json
{
  "sport": "football",
  "eventId": "evt_123",
  "odds": {
    "home": 1.5,
    "away": 2.5
  }
}
```

**Validation rules:**
- `sport`: Required. One of: `football`, `tennis`, `basketball`, `horse_racing`
- `eventId`: Required. Non-empty string
- `odds`: Required. Object with at least 2 selections, each value must be > 1

**Response:** `201 Created` with the created market, or `400 Bad Request` with validation errors.

### GET /markets/:id

Retrieves a market by its ID.

**Response:** `200 OK` with the market, or `404 Not Found` if the market does not exist.

### POST /markets/:id/odds

Updates the odds for a market. Emits an `odds_changed` domain event.

**Request body:**
```json
{
  "odds": {
    "home": 1.8,
    "away": 2.2
  }
}
```

**Validation rules:**
- `odds`: Required. Object with at least 2 selections, each value must be > 1

**Response:** `200 OK` with the updated market, `400 Bad Request` with validation errors, or `404 Not Found` if the market does not exist.

## Configuration

Environment variables:
- `PORT` - Server port (default: 3000)
- `HOST` - Server host (default: 0.0.0.0)

## Design Decisions

- **Fastify over Express**: Fastify has built-in JSON parsing, better TypeScript support, and improved performance.
- **Minimal configuration**: Only essential settings are configured to keep the codebase simple and readable.
- **No external config library**: Using environment variables directly keeps dependencies minimal.
