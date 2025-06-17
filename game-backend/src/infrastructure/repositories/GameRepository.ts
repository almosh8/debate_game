import { Game } from "../../domain/Game";
import { Player } from "../../domain/Player";
import { IGameRepository } from "../../application/interfaces/IGameRepository";
import { DatabaseClient } from "../DatabaseClient";
import { Logger } from "../../utils/Logger";
import { v4 as uuid } from "uuid";

export class GameRepository implements IGameRepository {
    private logger: Logger = Logger.getInstance();

    constructor(private db: DatabaseClient) {
        this.logger.info("GameRepository initialized");
    }

    async createGame(players: Player[]): Promise<Game> {
        const game = new Game(uuid(), players, "waiting");
        await this.save(game);
        return game;
    }

    async save(game: Game): Promise<void> {
        this.logger.debug(`Saving game: ${game.id}`);
        try {
            await this.db.set(`game:${game.id}`, JSON.stringify(game));
            this.logger.info(`Game saved: ${game.id}`);
        } catch (error) {
            this.logger.error(`Error saving game ${game.id}: ${error}`);
            throw error;
        }
    }

    async findById(gameId: string): Promise<Game | null> {
        this.logger.debug(`Fetching game: ${gameId}`);
        try {
            const data = await this.db.get(`game:${gameId}`);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            this.logger.error(`Error fetching game ${gameId}: ${error}`);
            throw error;
        }
    }
}