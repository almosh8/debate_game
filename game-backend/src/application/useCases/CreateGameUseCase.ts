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

    async execute(players: Player[]): Promise<Game> {
        this.logger.info("Creating new game with players");

        if (players.length < 3) {
            throw new Error("Minimum 3 players required to start game");
        }

        const game = new Game(
            uuid(),
            players,
            "waiting"
        );

        await this.gameRepository.save(game);
        this.logger.info(`Game created: ${game.id}`);
        return game;
    }
}
