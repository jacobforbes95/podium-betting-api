# AI Workflow

## Tooling Used
- GitHub Copilot in WebStorm IDE
- Claude Sonnet 4.5 model

## Goal
Use AI as a primary development accelerator while keeping design decisions deliberate and the solution intentionally minimal.

## How I Used AI
- Created a manual repo-level instructions file (`copilot-instructions.md`) to guide AI usage, development principles, and documentation expectations.
- Used Copilot to scaffold the initial Fastify server and TypeScript project structure.
- Used Copilot incrementally for each feature (market creation, filtering, odds updates, SSE streaming), rather than generating the solution in one pass.
- Reviewed all generated code to ensure clarity, minimalism, and consistency with the time-boxed scope.
- Used AI assistance for tests and documentation, while ensuring both reflected the actual behaviour of the system.

## Example Prompts and Judgement

### Project scaffolding
Prompt:
> “Create a minimal Fastify server in TypeScript, include JSON body parsing and a health endpoint, keep configuration simple and readable.”

Outcome:
- Accepted the proposed structure as it aligned with the intended minimal scope.
- Removed or avoided unnecessary configuration and plugins not required for the exercise.

### Domain model and validation
Prompt:
> “Define a Market domain model for a betting system. Include id, sport, eventId, status, odds, updatedAt. Keep odds representation simple. Add input validation. Avoid over-engineering.”

Outcome:
- Used the suggested structure as a baseline.
- Kept the model intentionally small and avoided adding strong domain invariants not required by the brief.

### In-memory store
Prompt:
> “Implement a simple in-memory store for markets using a Map keyed by market id.”

Outcome:
- Accepted the approach as it clearly demonstrated behaviour without introducing persistence concerns.
- Ensured defaults (e.g. status) were applied explicitly in code.

### Core endpoints
Prompt:
> “Implement POST /markets, validate input, store market in memory, return created market.”

Outcome:
- Used the generated handler as a starting point.
- Ensured validation, error handling, and response shapes were explicit and readable.
- Followed up to add tests and update the README to reflect the implemented behaviour.

### Filtering and retrieval
Prompts:
> "Implement GET /markets/:id, return 404 if market does not exist."
> "Implement GET /markets with optional sport and status filters."

Outcome:
- Accepted the general approach.
- Simplified the store API by removing unused methods once filtering covered all list cases.

### Odds updates and eventing
Prompt:
> “Implement POST /markets/:id/odds. Update odds and updatedAt. Emit an odds_changed domain event.”

Outcome:
- Used AI to introduce a simple internal event bus abstraction.
- Ensured event emission was decoupled from HTTP delivery.

### SSE streaming
Prompt:
> “Expose odds_changed events via Server-Sent Events using the existing event bus. Keep implementation minimal and readable.”

Outcome:
- Accepted the per-connection subscription pattern.
- Ensured handlers are removed on client disconnect to avoid memory leaks.
- Deliberately avoided adding buffering, reconnection logic, or additional protocol complexity.

### API testing
Prompt:
> "Write basic API tests using supertest."

Outcome:
- Accepted the generated test structure covering all endpoints.
- Refactored the server to export the Fastify instance for testing without starting the listener.
- Ensured tests covered both success and error cases for each endpoint.

## Summary
AI was used throughout as a productivity and ideation tool, but all architectural decisions, scope control, and simplifications were applied deliberately to match the assessment constraints.
