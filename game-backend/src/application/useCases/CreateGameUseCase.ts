// src/application/useCases/CreateGameUseCase.ts
import { Game } from "../../domain/Game";
import { Player } from "../../domain/Player";
import { IGameRepository } from "../interfaces/IGameRepository";
import { Logger } from "../../utils/Logger";
import { v4 as uuid } from "uuid";

export class CreateGameUseCase {
    private logger: Logger = Logger.getInstance();

    constructor(private gameRepository: IGameRepository) {
        this.logger.info("CreateGameUseCase initialized");
    }

    async execute(data: { 
        roomId: string;
        players: Player[];
        adminId: string;
    }): Promise<Game> {
        this.logger.info(`Creating new game for room: ${data.roomId}`);

        if (data.players.length < 3) {
            throw new Error("Minimum 3 players required to start game");
        }

        const game = new Game(
            data.roomId,
            data.players,
            "waiting",
            data.adminId
        );

        await this.gameRepository.save(game);
        this.logger.info(`Game created: ${game.id} for room: ${data.roomId}`);
        return game;
    }
}