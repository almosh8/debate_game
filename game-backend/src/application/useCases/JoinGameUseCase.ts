import { IGameRepository } from "../../domain/interfaces/IGameRepository";
import { Game } from "../../domain/Game";
import { Player } from "../../domain/Player";

export class JoinGameUseCase {
  constructor(private gameRepository: IGameRepository) {}

  async execute(roomId: string, player: Player): Promise<Game> {
    return this.gameRepository.joinGame(roomId, player);
  }
}
