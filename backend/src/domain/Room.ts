// src/domain/Room.ts

import { Player } from "./Player"

export class Room {
    constructor(
      public readonly id: string,
      public readonly adminId: string,
      public readonly players: Player[],
      public readonly status: "waiting" | "in_progress" | "finished"
    ) {}
  }