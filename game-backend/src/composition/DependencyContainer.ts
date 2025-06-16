import { LevelDBClient } from "../infrastructure/database/DatabaseClient";
import { GameRepository } from "../infrastructure/repositories/IGameRepository";
import { FetchGameUseCase } from "../application/useCases/FetchGameUseCase";
import { JoinGameUseCase } from "../application/useCases/JoinGameUseCase";
import { GameService } from "../application/services/GameService";
import { GameController } from "../presentation/controllers/GameController";

export class DependencyContainer {
  private gameController: GameController;
  private fetchGameUseCase: FetchGameUseCase;
  private joinGameUseCase: JoinGameUseCase;

  constructor() {
    const db = new LevelDBClient();
    const gameRepo = new GameRepository(db);
    
    this.fetchGameUseCase = new FetchGameUseCase(gameRepo);
    this.joinGameUseCase = new JoinGameUseCase(gameRepo);
    
    const gameService = new GameService(
      this.fetchGameUseCase,
      this.joinGameUseCase
    );
    
    this.gameController = new GameController(gameService);
  }

  public getGameController(): GameController {
    return this.gameController;
  }

  public getFetchGameUseCase(): FetchGameUseCase {
    return this.fetchGameUseCase;
  }

  public getJoinGameUseCase(): JoinGameUseCase {
    return this.joinGameUseCase;
  }
}
