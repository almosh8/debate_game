// src/presentation/controllers/GameController.ts
import { Request, Response } from "express";
import { CreateGameUseCase } from "../../application/useCases/CreateGameUseCase";
import { GetGameUseCase } from "../../application/useCases/GetGameUseCase";
import { Logger } from "../../utils/Logger";

export class GameController {
    private logger: Logger = Logger.getInstance();

    constructor(
        private createGameUseCase: CreateGameUseCase,
        private getGameUseCase: GetGameUseCase
    ) {
        this.logger.info("GameController initialized");
    }

    async createGame(req: Request, res: Response) {
        try {
            const { roomId, players, adminId } = req.body;
            
            if (!roomId || !players || !Array.isArray(players) || !adminId) {
                return res.status(400).json({ 
                    error: "Required fields: roomId, players array, and adminId" 
                });
            }

            const game = await this.createGameUseCase.execute({
                roomId,
                players,
                adminId
            });
            
            return res.status(201).json({
                id: game.id,
                status: game.status,
                players: game.players,
                adminId: game.adminId,
                createdAt: new Date().toISOString()
            });
        } catch (error) {
            this.logger.error(`Error creating game: ${error}`);
            return res.status(500).json({ 
                error: error instanceof Error ? error.message : "Failed to create game" 
            });
        }
    }

    async getGame(req: Request, res: Response) {
        try {
            const gameId = req.params.gameId;
            const game = await this.getGameUseCase.execute(gameId);
            
            if (!game) {
                return res.status(404).json({ error: "Game not found" });
            }
            
            return res.status(200).json({
                id: game.id,
                status: game.status,
                players: game.players,
                adminId: game.adminId,
                currentJudgeId: game.currentJudgeId,
                path1: game.path1,
                path2: game.path2,
                currentTurn: game.currentTurn,
                timer: game.timer,
                round: game.round
            });
        } catch (error) {
            this.logger.error(`Error getting game: ${error}`);
            return res.status(500).json({ 
                error: error instanceof Error ? error.message : "Failed to get game" 
            });
        }
    }

}