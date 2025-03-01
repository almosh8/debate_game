// src/domain/Room.ts
export class Room {
    constructor(
      public readonly id: string,
      public readonly adminId: string,
      public readonly players: Player[],
      public readonly status: "waiting" | "in_progress" | "finished"
    ) {}
  }