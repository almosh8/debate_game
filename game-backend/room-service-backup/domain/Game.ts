// src/domain/Game.ts
import { Player } from "./Player";
import { Card } from "./Card";

export type GameStage = 
  | "card_selection" 
  | "initial_argumentation" 
  | "team_discussion" 
  | "judge_speech" 
  | "final_decision";

export class Game {
  public team1: Player[]; // Команда 1
  public team2: Player[]; // Команда 2
  public judge: Player;

  constructor(
    public id: string,
    public roomId: string,
    public round: number,
    public players: Player[],
    public currentJudgeId: string,
    public path1: (Card | null)[] = [],
    public path2: (Card | null)[] = [],
    public currentTurn: {
      seatNumber: number;
      stage: GameStage;
    } | null = null,
    public timer: number = 0
  ) {
    const judgeIndex = this.players.findIndex((p) => p.id === this.currentJudgeId);
    this.judge = this.players[judgeIndex];
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