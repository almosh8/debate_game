import { Card } from "./Card";

export class Player {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly role: "admin" | "participant",
    public readonly seatNumber: number,
    public readonly cards: Card[] | null = null,
    public readonly color: string | null = null // Делаем цвет опциональным
  ) {
    // Если цвет не задан, генерируем его на основе username
    if (color === null) {
      this.color = this.generateColorFromUsername(username);
    }
  }

  private generateColorFromUsername(username: string): string {
    // Простая хеш-функция для преобразования строки в число
    const hash = this.stringToHash(username);
    
    // Генерация HSL цвета с фиксированной насыщенностью и яркостью
    const hue = hash % 360; // hue в диапазоне 0-359
    return `hsl(${hue}, 70%, 60%)`; // Яркие, но не слишком насыщенные цвета
  }

  private stringToHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0; // Преобразуем в 32-битное целое
    }
    return Math.abs(hash);
  }
}