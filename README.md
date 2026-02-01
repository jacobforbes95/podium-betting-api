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

| Method | Path      | Description         |
|--------|-----------|---------------------|
| GET    | `/health` | Health check endpoint |

## Configuration

Environment variables:
- `PORT` - Server port (default: 3000)
- `HOST` - Server host (default: 0.0.0.0)

## Design Decisions

- **Fastify over Express**: Fastify has built-in JSON parsing, better TypeScript support, and improved performance.
- **Minimal configuration**: Only essential settings are configured to keep the codebase simple and readable.
- **No external config library**: Using environment variables directly keeps dependencies minimal.
