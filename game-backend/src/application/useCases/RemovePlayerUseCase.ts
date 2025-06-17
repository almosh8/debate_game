// src/application/useCases/RemovePlayerUseCase.ts
import { Game } from "../../domain/Game";
import { IGameRepository } from "../interfaces/IGameRepository";
import { Logger } from "../../utils/Logger";

export class RemovePlayerUseCase {
  private logger: Logger = Logger.getInstance();

  constructor(private GameRepository: IGameRepository) {
    this.logger.info("RemovePlayerUseCase initialized");
  }

  async execute(gameId: string, playerId: string): Promise<Game> {
    this.logger.info(`Removing player: ${playerId} from game: ${gameId}`);


    const game = await this.GameRepository.findById(gameId);
    if (!game) {
      throw new Error("Game not found");
    }


    if(playerId === "pending") {
      return game;
    }

    // Удаляем игрока
    
    // Находим индекс игрока, которого нужно удалить
const playerIndex = game.players.findIndex(player => player.id === playerId);

if (playerIndex !== -1) {
    // Удаляем игрока из массива, мутируя исходный массив
    game.players.splice(playerIndex, 1);
}
    // Сохраняем обновленную комнату
    await this.GameRepository.save(game);

    this.logger.info(`Player removed: ${playerId}`);
    return game;
  }
}

