// src/domain/Game.ts
import { Player } from "./Player";
import { Card } from "./Card";

export type GameStatus = "waiting" | "starting" | "in_progress" | "finished";
export type GameStage = 
    | "card_selection" 
    | "initial_argumentation" 
    | "team_discussion" 
    | "judge_speech" 
    | "final_decision";

export class Game {
    public team1: Player[];
    public team2: Player[];
    public judge: Player | null;
    public path1: Card[];
    public path2: Card[];
    public currentTurn: { seatNumber: number; stage: GameStage } | null;
    public timer: number;
    public round: number;

    constructor(
        public readonly id: string,
        public readonly players: Player[],
        public status: GameStatus,
        public readonly adminId: string,
        public currentJudgeId: string | null = null,
        path1: Card[] = [],
        path2: Card[] = [],
        currentTurn: { seatNumber: number; stage: GameStage } | null = null,
        timer: number = 0,
        round: number = 1
    ) {
        this.path1 = path1;
        this.path2 = path2;
        this.currentTurn = currentTurn;
        this.timer = timer;
        this.round = round;
        this.judge = null;
        this.team1 = [];
        this.team2 = [];

        if (currentJudgeId && players.length > 0) {
            this.setJudge(currentJudgeId);
        }
    }

    private setJudge(judgeId: string): void {
        const judgeIndex = this.players.findIndex(p => p.id === judgeId);
        if (judgeIndex === -1) return;

        this.judge = this.players[judgeIndex];
        this.currentJudgeId = judgeId;
        
        // Формируем команды
        for (let i = 1; i <= 3; i++) {
            const leftPlayer = this.players[(judgeIndex - i + this.players.length) % this.players.length];
            const rightPlayer = this.players[(judgeIndex + i) % this.players.length];
            if (leftPlayer) this.team1.push(leftPlayer);
            if (rightPlayer) this.team2.push(rightPlayer);
        }
    }
}