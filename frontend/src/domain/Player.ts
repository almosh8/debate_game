import { Card } from "./Card";

// src/domain/Player.ts
export class Player {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly role: "admin" | "participant",
    public readonly seatNumber: number,
    public readonly cards: Card[],
    public readonly color: string // Добавляем поле color
  ) {}
}