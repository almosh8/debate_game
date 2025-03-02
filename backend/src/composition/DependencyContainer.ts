// src/composition/DependencyContainer.ts
import { DatabaseClient } from "../infrastructure/DatabaseClient";
import { RoomRepository } from "../infrastructure/repositories/RoomRepository";
import { CreateRoomUseCase } from "../application/useCases/CreateRoomUseCase";
import { GetRoomUseCase } from "../application/useCases/GetRoomUseCase";
import { RoomController } from "../presentation/controllers/RoomController";
import { GetRoomController } from "../presentation/controllers/GetRoomController";
import { Logger } from "../utils/Logger";
import { LevelDBClient } from "../infrastructure/LevelDBClient";

export class DependencyContainer {
  private db: DatabaseClient;
  private roomRepository: RoomRepository;
  private createRoomUseCase: CreateRoomUseCase;
  private getRoomUseCase: GetRoomUseCase;
  private roomController: RoomController;
  private getRoomController: GetRoomController;
  private logger: Logger = Logger.getInstance();

  constructor() {
    this.logger.info("Initializing dependencies...");

    this.db = new LevelDBClient();
    this.roomRepository = new RoomRepository(this.db);
    this.createRoomUseCase = new CreateRoomUseCase(this.roomRepository);
    this.getRoomUseCase = new GetRoomUseCase(this.roomRepository);
    this.roomController = new RoomController(this.createRoomUseCase);
    this.getRoomController = new GetRoomController(this.getRoomUseCase);

    this.logger.info("Dependencies initialized successfully");
  }

  _getRoomController(): RoomController {
    return this.roomController;
  }

  getGetRoomController(): GetRoomController {
    return this.getRoomController;
  }
}