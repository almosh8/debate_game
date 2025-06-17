// src/domain/Card.ts
export class Card {
    constructor(
      public readonly id: string,
      public readonly type: "good" | "bad" | "secret",
      public readonly name: string,
      public readonly description: string,
      public readonly imageUrl: string
    ) {}
  }