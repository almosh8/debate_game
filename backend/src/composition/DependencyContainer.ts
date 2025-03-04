// src/composition/DependencyContainer.ts
import { DatabaseClient } from "../infrastructure/DatabaseClient";
import { RoomRepository } from "../infrastructure/repositories/RoomRepository";
import { CreateRoomUseCase } from "../application/useCases/CreateRoomUseCase";
import { GetRoomUseCase } from "../application/useCases/GetRoomUseCase";
import { JoinRoomUseCase } from "../application/useCases/JoinRoomUseCase";
import { RemovePlayerUseCase } from "../application/useCases/RemovePlayerUseCase";
import { RoomController } from "../presentation/controllers/RoomController";
import { GetRoomController } from "../presentation/controllers/GetRoomController";
import { Logger } from "../utils/Logger";
import { LevelDBClient } from "../infrastructure/LevelDBClient";
import { Server } from "socket.io";
import { SocketHandler } from "../presentation/socketHandler";

export class DependencyContainer {
  private db: DatabaseClient;
  private roomRepository: RoomRepository;
  private createRoomUseCase: CreateRoomUseCase;
  private getRoomUseCase: GetRoomUseCase;
  private joinRoomUseCase: JoinRoomUseCase;
  private removePlayerUseCase: RemovePlayerUseCase;
  private roomController: RoomController;
  private getRoomController: GetRoomController;
  private socketHandler: SocketHandler;
  private logger: Logger = Logger.getInstance();

  constructor(private io: Server) {
    this.logger.info("Initializing dependencies...");

    this.db = new LevelDBClient();
    this.roomRepository = new RoomRepository(this.db);
    this.createRoomUseCase = new CreateRoomUseCase(this.roomRepository);
    this.getRoomUseCase = new GetRoomUseCase(this.roomRepository);
    this.joinRoomUseCase = new JoinRoomUseCase(this.roomRepository);
    this.removePlayerUseCase = new RemovePlayerUseCase(this.roomRepository);
    this.socketHandler = new SocketHandler(this.io, this.removePlayerUseCase);
    this.roomController = new RoomController(
      this.createRoomUseCase,
      this.getRoomUseCase,
      this.joinRoomUseCase,
    this.removePlayerUseCase,
      this.socketHandler
    );
    this.getRoomController = new GetRoomController(this.getRoomUseCase);

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
}