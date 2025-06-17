import { Request, Response } from "express";
import { CreateGameUseCase } from "../../application/useCases/CreateGameUseCase";
import { GetGameUseCase } from "../../application/useCases/GetGameUseCase";
import { JoinGameUseCase } from "../../application/useCases/JoinGameUseCase";
import { RemovePlayerUseCase } from "../../application/useCases/RemovePlayerUseCase";
import { Player } from "../../domain/Player";
import { Logger } from "../../utils/Logger";
import { StartGameUseCase } from "../../application/useCases/StartGameUseCase";

export class GameController {
    private logger: Logger = Logger.getInstance();

    constructor(
        private createGameUseCase: CreateGameUseCase,
        private getGameUseCase: GetGameUseCase,
        private joinGameUseCase: JoinGameUseCase,
        private removePlayerUseCase: RemovePlayerUseCase,
        private startGameUseCase: StartGameUseCase
    ) {
        this.logger.info("GameController initialized");
    }

    async createGame(req: Request, res: Response) {
        try {
            const players: Player[] = req.body.players;
            
            if (!players || !Array.isArray(players)) {
                return res.status(400).json({ error: "Players array is required" });
            }

            const game = await this.createGameUseCase.execute(players);
            return res.status(201).json(game);
        } catch (error) {
            this.logger.error(`Error creating game: ${error}`);
            return res.status(500).json({ error: error instanceof Error ? error.message : "Failed to create game" });
        }
    }

    async getGame(req: Request, res: Response) {
        try {
            const gameId = req.params.gameId;
            const game = await this.getGameUseCase.execute(gameId);
            
            if (!game) {
                return res.status(404).json({ error: "Game not found" });
            }
            
            return res.status(200).json(game);
        } catch (error) {
            this.logger.error(`Error getting game: ${error}`);
            return res.status(500).json({ error: error instanceof Error ? error.message : "Failed to get game" });
        }
    }

    async joinGame(req: Request, res: Response) {
        try {
            const gameId = req.params.id;
            const { playerId, seatNumber } = req.body;
            
            const game = await this.joinGameUseCase.execute(gameId, playerId, seatNumber);
            return res.status(200).json(game);
        } catch (error) {
            this.logger.error(`Error joining game: ${error}`);
            return res.status(500).json({ error: error instanceof Error ? error.message : "Failed to join game" });
        }
    }

    async removePlayer(req: Request, res: Response) {
        try {
            const gameId = req.params.id;
            const playerId = req.body.playerId;
            
            const game = await this.removePlayerUseCase.execute(gameId, playerId);
            return res.status(200).json(game);
        } catch (error) {
            this.logger.error(`Error removing player: ${error}`);
            return res.status(500).json({ error: error instanceof Error ? error.message : "Failed to remove player" });
        }
    }

    async startGame(req: Request, res: Response) {
        try {
            const gameId = req.params.id;
            const result = await this.startGameUseCase.execute(gameId);
            
            if (!result.success) {
                return res.status(400).json(result);
            }
            
            return res.status(200).json(result);
        } catch (error) {
            this.logger.error(`Error starting game: ${error}`);
            return res.status(500).json({ 
                success: false,
                error: error instanceof Error ? error.message : "Failed to start game" 
            });
        }
    }
}
