import { FetchGameUseCase } from "../useCases/FetchGameUseCase";
import { JoinGameUseCase } from "../useCases/JoinGameUseCase";
import { Game } from "../../domain/Game";
import { Player } from "../../domain/Player";

export class GameService {
  constructor(
    private fetchGameUseCase: FetchGameUseCase,
    private joinGameUseCase: JoinGameUseCase
  ) {}

  async fetchGame(roomId: string): Promise<Game> {
    return this.fetchGameUseCase.execute(roomId);
  }

  async joinGame(roomId: string, player: Player): Promise<Game> {
    return this.joinGameUseCase.execute(roomId, player);
  }
}
