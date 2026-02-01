# Development Guidelines

This repository is intentionally time-boxed and prioritises clarity and judgement
over completeness or production polish.

General principles:
- Keep the solution minimal and readable.
- Prefer simple, explicit code over abstractions.
- Avoid premature optimisation or speculative features.
- Treat this as a demonstration of decision-making, not a finished system.
- Include tests for critical paths and business logic.

AI usage:
- AI tools are used as a primary development aid.
- Generated code should be reviewed, simplified, and adapted as needed.
- Over-engineered suggestions should be avoided or removed.

Documentation:
- README.md should be kept up to date with architectural decisions,
  endpoints, and notable trade-offs as the implementation evolves.
- Documentation should explain *why* decisions were made, not just *what* was built.

Constraints:
- In-memory storage only.
- No authentication.
- No persistence.
- Focus on create, retrieve, and odds update flows.
