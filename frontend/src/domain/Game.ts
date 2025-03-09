import { Player } from "./Player";
import { Card } from "./Card";

export default class Game {
  constructor(
    public id: string, // Уникальный идентификатор игры
    public roomId: string, // Идентификатор комнаты
    public round: number, // Текущий раунд
    public players: Player[], // Список игроков
    public currentJudgeId: string, // ID текущего судьи
    public path1: Card[] = [], // Карты на левом пути
    public path2: Card[] = [] // Карты на правом пути
  ) {}

  // Метод для определения команд (опционально, если нужно на фронте)
  getTeams(): { team1: Player[]; team2: Player[] } {
    const judgeIndex = this.players.findIndex((p) => p.id === this.currentJudgeId);
    const team1 = [];
    const team2 = [];

    for (let i = 1; i <= 3; i++) {
      const leftPlayer = this.players[(judgeIndex - i + 7) % 7];
      const rightPlayer = this.players[(judgeIndex + i) % 7];
      if (leftPlayer) team1.push(leftPlayer);
      if (rightPlayer) team2.push(rightPlayer);
    }

    return { team1, team2 };
  }
}