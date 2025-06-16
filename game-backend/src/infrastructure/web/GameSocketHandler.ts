import { Server, Socket } from "socket.io";
import { FetchGameUseCase } from "../../application/useCases/FetchGameUseCase";
import { JoinGameUseCase } from "../../application/useCases/JoinGameUseCase";
import { Logger } from "../../utils/Logger";

export class GameSocketHandler {
  private logger = Logger.getInstance();

  constructor(
    private io: Server,
    private fetchGameUseCase: FetchGameUseCase,
    private joinGameUseCase: JoinGameUseCase
  ) {
    this.initialize();
  }

  public initialize() {
    this.io.on("connection", (socket: Socket) => {
      this.logger.info(`New client connected: ${socket.id}`);

      // Подключение к игровой комнате
      socket.on("joinGameRoom", async (roomId: string) => {
        try {
          socket.join(roomId);
          const game = await this.fetchGameUseCase.execute(roomId);
          this.io.to(roomId).emit("gameStateUpdate", game);
          this.logger.info(`Client ${socket.id} joined room ${roomId}`);
        } catch (error) {
          this.logger.error(`Error joining room: ${error}`);
          socket.emit("error", { message: "Failed to join game room" });
        }
      });

      // Обработка нового игрока
      socket.on("playerJoined", async (roomId: string, playerData: any) => {
        try {
          const game = await this.joinGameUseCase.execute(roomId, playerData);
          this.io.to(roomId).emit("gameStateUpdate", game);
        } catch (error) {
          this.logger.error(`Error adding player: ${error}`);
          socket.emit("error", { message: "Failed to add player" });
        }
      });

      // Отключение игрока
      socket.on("disconnect", () => {
        this.logger.info(`Client disconnected: ${socket.id}`);
      });
    });
  }
}