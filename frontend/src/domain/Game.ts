import { Player } from "./Player";
import { Card } from "./Card";

export default class Game {
  public team1: Player[]; // Команда 1
  public team2: Player[]; // Команда 2
  public judge: Player;

  constructor(
    public id: string, // Уникальный идентификатор игры
    public roomId: string, // Идентификатор комнаты
    public round: number, // Текущий раунд
    public players: Player[], // Список игроков
    public currentJudgeId: string, // ID текущего судьи
    public path1: Card[] = [], // Карты на левом пути
    public path2: Card[] = [] // Карты на правом пути
  ) {
    // Вычисляем команды при создании объекта
    const judgeIndex = this.players.findIndex((p) => p.id === this.currentJudgeId);
    this.judge = this.players[judgeIndex]
    this.team1 = [];
    this.team2 = [];

    for (let i = 1; i <= 3; i++) {
      const leftPlayer = this.players[(judgeIndex - i + 7) % 7];
      const rightPlayer = this.players[(judgeIndex + i) % 7];
      if (leftPlayer) this.team1.push(leftPlayer);
      if (rightPlayer) this.team2.push(rightPlayer);
    }
  }
}