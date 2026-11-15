type Listener = (...args: unknown[]) => void;

class EventBridge {
  private events: Map<string, Listener[]> = new Map();

  on(event: string, listener: Listener) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)?.push(listener);
    return () => this.off(event, listener);
  }

  off(event: string, listener: Listener) {
    const arr = this.events.get(event);
    if (!arr) return;
    this.events.set(event, arr.filter(l => l !== listener));
  }

  emit(event: string, ...args: unknown[]) {
    const listeners = this.events.get(event);
    if (listeners) {
      listeners.forEach(fn => {
        try {
          fn(...args);
        } catch (e) {
          console.error(`Error in EventBridge listener for ${event}:`, e);
        }
      });
    }
  }

  clear() {
    this.events.clear();
  }
}

export const eventBridge = new EventBridge();
