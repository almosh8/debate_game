import { DatabaseClient } from "../infrastructure/DatabaseClient";
import { GameRepository } from "../infrastructure/repositories/GameRepository";
import { CreateGameUseCase } from "../application/useCases/CreateGameUseCase";
import { GetGameUseCase } from "../application/useCases/GetGameUseCase";
import { JoinGameUseCase } from "../application/useCases/JoinGameUseCase";
import { RemovePlayerUseCase } from "../application/useCases/RemovePlayerUseCase";
import { StartGameUseCase } from "../application/useCases/StartGameUseCase";
import { GetGameController } from "../presentation/controllers/GetGameController";
import { GameController } from "../presentation/controllers/GameController";
import { Logger } from "../utils/Logger";
import { LevelDBClient } from "../infrastructure/LevelDBClient";
import { Server } from "socket.io";
import { SocketHandler } from "../presentation/socketHandler";

export class DependencyContainer {
  private db: DatabaseClient;
  private gameRepository: GameRepository; // Исправлено на camelCase
  private createGameUseCase: CreateGameUseCase;
  private getGameUseCase: GetGameUseCase;
  private joinGameUseCase: JoinGameUseCase;
  private removePlayerUseCase: RemovePlayerUseCase; // Исправлено на camelCase
  private startGameUseCase: StartGameUseCase;
  private gameController: GameController;
  private getGameController: GetGameController;
  private socketHandler: SocketHandler;
  private logger: Logger = Logger.getInstance();

  constructor(private io: Server) {
    this.logger.info("Initializing dependencies...");

    // Initialize database clients
    this.db = new LevelDBClient();
    
    // Initialize repositories
    this.gameRepository = new GameRepository(this.db);

   
    // Initialize use cases
    this.createGameUseCase = new CreateGameUseCase(this.gameRepository);
    this.getGameUseCase = new GetGameUseCase(this.gameRepository);
    this.joinGameUseCase = new JoinGameUseCase(this.gameRepository);
    this.removePlayerUseCase = new RemovePlayerUseCase(this.gameRepository);
    this.startGameUseCase = new StartGameUseCase(
      this.gameRepository
    );

    // Initialize socket handler
    this.socketHandler = new SocketHandler(
      this.io, 
      this.removePlayerUseCase,
      this.startGameUseCase
    );

    // Initialize controllers - единая инициализация GameController
    this.gameController = new GameController(
      this.createGameUseCase,
      this.getGameUseCase,
      this.joinGameUseCase,
      this.removePlayerUseCase,
      this.startGameUseCase
    );
    
    this.getGameController = new GetGameController(this.getGameUseCase);

    this.logger.info("Dependencies initialized successfully");
  }

  _getGameController(): GameController {
    return this.gameController;
  }

  getGetGameController(): GetGameController {
    return this.getGameController;
  }

  getRemovePlayerUseCase(): RemovePlayerUseCase {
    return this.removePlayerUseCase;
  }

  getStartGameUseCase(): StartGameUseCase {
    return this.startGameUseCase;
  }

  getSocketHandler(): SocketHandler {
    return this.socketHandler;
  }
}