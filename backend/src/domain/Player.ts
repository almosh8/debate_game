// src/domain/Player.ts
export class Player {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly role: "admin" | "participant",
    public readonly seatNumber: number // Добавляем seatNumber
  ) {}
}