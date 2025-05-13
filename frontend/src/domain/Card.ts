// src/domain/Card.ts
export class Card {
  constructor(
    public readonly id: string,
    public readonly type: "good" | "bad" | "secret",
    public readonly name: string,
    public readonly description: string, // храним JSON с playedOn
    public readonly imageUrl: string
  ) {}

  getPlayedOn(): string | null {
    try {
      const desc = JSON.parse(this.description);
      return desc.playedOn || null;
    } catch {
      return null;
    }
  }
}