import { DatabaseClient } from "../infrastructure/DatabaseClient";
import { RoomRepository } from "../infrastructure/repositories/RoomRepository";
import { CreateRoomUseCase } from "../application/useCases/CreateRoomUseCase";
import { GetRoomUseCase } from "../application/useCases/GetRoomUseCase";
import { JoinRoomUseCase } from "../application/useCases/JoinRoomUseCase";
import { RemovePlayerUseCase } from "../application/useCases/RemovePlayerUseCase";
import { StartGameUseCase } from "../application/useCases/StartGameUseCase";
import { RoomController } from "../presentation/controllers/RoomController";
import { GetRoomController } from "../presentation/controllers/GetRoomController";
import { GameController } from "../presentation/controllers/GameController";
import { Logger } from "../utils/Logger";
import { LevelDBClient } from "../infrastructure/LevelDBClient";
import { Server } from "socket.io";
import { SocketHandler } from "../presentation/socketHandler";
import { WebSocketClient } from "../infrastructure/WebSocketClient";
import { GameServiceClient } from "../infrastructure/GameServiceClient";

export class DependencyContainer {
  private db: DatabaseClient;
  private roomRepository: RoomRepository;
  private createRoomUseCase: CreateRoomUseCase;
  private getRoomUseCase: GetRoomUseCase;
  private joinRoomUseCase: JoinRoomUseCase;
  private removePlayerUseCase: RemovePlayerUseCase;
  private startGameUseCase: StartGameUseCase;
  private roomController: RoomController;
  private getRoomController: GetRoomController;
  private gameController: GameController;
  private socketHandler: SocketHandler;
  private logger: Logger = Logger.getInstance();

  constructor(private io: Server) {
    this.logger.info("Initializing dependencies...");

    // Инициализация клиентов базы данных
    this.db = new LevelDBClient();
    
    // Инициализация репозиториев
    this.roomRepository = new RoomRepository(this.db);

    // Инициализация клиентов сервисов
    const webSocketClient = new WebSocketClient("http://localhost:5000");
    const gameServiceClient = new GameServiceClient();

    // Инициализация use cases
    this.createRoomUseCase = new CreateRoomUseCase(this.roomRepository);
    this.getRoomUseCase = new GetRoomUseCase(this.roomRepository);
    this.joinRoomUseCase = new JoinRoomUseCase(this.roomRepository);
    this.removePlayerUseCase = new RemovePlayerUseCase(this.roomRepository);
    this.startGameUseCase = new StartGameUseCase(
      this.roomRepository,
      gameServiceClient,
      webSocketClient
    );

    // Инициализация обработчика сокетов
    this.socketHandler = new SocketHandler(
      this.io, 
      this.removePlayerUseCase,
      this.startGameUseCase
    );

    // Инициализация контроллеров
    this.roomController = new RoomController(
      this.createRoomUseCase,
      this.getRoomUseCase,
      this.joinRoomUseCase,
      this.removePlayerUseCase,
      this.socketHandler
    );
    
    this.getRoomController = new GetRoomController(this.getRoomUseCase);
    this.gameController = new GameController(this.startGameUseCase);

    this.logger.info("Dependencies initialized successfully");
  }

  _getRoomController(): RoomController {
    return this.roomController;
  }

  getGetRoomController(): GetRoomController {
    return this.getRoomController;
  }

  getRemovePlayerUseCase(): RemovePlayerUseCase {
    return this.removePlayerUseCase;
  }

  getStartGameUseCase(): StartGameUseCase {
    return this.startGameUseCase;
  }

  getGameController(): GameController {
    return this.gameController;
  }

  getSocketHandler(): SocketHandler {
    return this.socketHandler;
  }
}