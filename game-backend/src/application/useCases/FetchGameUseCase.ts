import { IGameRepository } from "../../domain/interfaces/IGameRepository";
import { Game } from "../../domain/Game";

export class FetchGameUseCase {
  constructor(private gameRepository: IGameRepository) {}

  async execute(roomId: string): Promise<Game> {
    return this.gameRepository.fetchGame(roomId);
  }
}
