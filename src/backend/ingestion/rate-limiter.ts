export class PoliteRateLimiter {
  private lastRequestAt = 0;

  constructor(private readonly minDelayMs: number) {}

  async waitTurn() {
    const now = Date.now();
    const waitMs = Math.max(0, this.lastRequestAt + this.minDelayMs - now);

    if (waitMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }

    this.lastRequestAt = Date.now();
  }
}
