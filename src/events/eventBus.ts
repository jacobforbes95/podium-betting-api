type EventHandler<T = unknown> = (payload: T) => void;

const handlers = new Map<string, EventHandler[]>();

export function on<T>(event: string, handler: EventHandler<T>): void {
  const existing = handlers.get(event) || [];
  existing.push(handler as EventHandler);
  handlers.set(event, existing);
}

export function off<T>(event: string, handler: EventHandler<T>): void {
  const existing = handlers.get(event) || [];
  handlers.set(event, existing.filter(h => h !== handler));
}

export function emit<T>(event: string, payload: T): void {
  const existing = handlers.get(event) || [];
  for (const handler of existing) {
    handler(payload);
  }
}

export function clear(): void {
  handlers.clear();
}
