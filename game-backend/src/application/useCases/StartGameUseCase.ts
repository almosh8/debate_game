import { IGameRepository } from "../interfaces/IGameRepository";
import { Logger } from "../../utils/Logger";

export class StartGameUseCase {
    private logger: Logger = Logger.getInstance();

    constructor(private gameRepository: IGameRepository) {
        this.logger.info("StartGameUseCase initialized");
    }

    async execute(gameId: string): Promise<{ 
        success: boolean; 
        game?: any;
        error?: string 
    }> {
        try {
            this.logger.info(`Starting game: ${gameId}`);
            
            // 1. Get game from repository
            const game = await this.gameRepository.findById(gameId);
            if (!game) {
                this.logger.warn(`Game not found: ${gameId}`);
                return { success: false, error: "Game not found" };
            }

            // 2. Validate game state
            if (game.status !== "waiting") {
                this.logger.warn(`Game already started: ${gameId}`);
                return { success: false, error: "Game already started", game };
            }

            if (game.players.length < 3) {
                this.logger.warn(`Not enough players to start game: ${gameId}`);
                return { 
                    success: false, 
                    error: "Not enough players to start (minimum 3)",
                    game 
                };
            }

            // 3. Create and save new game state
            game.status = "in_progress";
            game.round = 1;
            game.currentJudgeId = game.players[0].id; // First player is judge
            
            await this.gameRepository.save(game);
            
            this.logger.info(`Game started successfully: ${gameId}`);
            return { 
                success: true, 
                game 
            };
        } catch (error) {
            this.logger.error(`Error starting game ${gameId}: ${error}`);
            
            // Revert game status if possible
            try {
                const game = await this.gameRepository.findById(gameId);
                if (game) {
                    game.status = "waiting";
                    await this.gameRepository.save(game);
                    this.logger.info(`Reverted game status to 'waiting': ${gameId}`);
                }
            } catch (revertError) {
                this.logger.error(`Failed to revert game status: ${revertError}`);
            }

            return { 
                success: false, 
                error: error instanceof Error ? error.message : "Failed to start game" 
            };
        }
    }
}
