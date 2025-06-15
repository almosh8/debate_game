import { Server, Socket } from "socket.io";
import { RemovePlayerUseCase } from "../application/useCases/RemovePlayerUseCase";
import { StartGameUseCase } from "../application/useCases/StartGameUseCase";
import { Logger } from "../utils/Logger";

const logger = Logger.getInstance();

export class SocketHandler {
  private socketToPlayerMap = new Map<string, string>();
  private socketToRoomMap = new Map<string, string>();

  constructor(
    private io: Server,
    private removePlayerUseCase: RemovePlayerUseCase,
    private startGameUseCase: StartGameUseCase
  ) {}

  public initialize() {
    this.io.on("connection", (socket: Socket) => {
      logger.info("A user connected");

      // Присоединение к комнате
      socket.on("joinRoom", (roomId: string, playerId: string) => {
        socket.join(roomId);
        this.socketToPlayerMap.set(socket.id, playerId);
        this.socketToRoomMap.set(socket.id, roomId);
        logger.info(`User ${playerId} joined room: ${roomId}`);
      });

      // Запрос на начало игры
      socket.on("startGame", async (roomId: string) => {
        logger.info(`Start game requested for room: ${roomId}`);
        try {
          const result = await this.startGameUseCase.execute(roomId);
          if (result.success) {
            this.emitRoomUpdate(roomId, { status: "starting" });
          }
        } catch (error) {
          logger.error(`Error starting game: ${error}`);
        }
      });

      // Отслеживание отключения пользователя
      socket.on("disconnect", async () => {
        logger.info("A user disconnected");
        const playerId = this.socketToPlayerMap.get(socket.id);
        const roomId = this.socketToRoomMap.get(socket.id);
        
        if (playerId && roomId) {
          try {
            const room = await this.removePlayerUseCase.execute(roomId, playerId);
            this.emitRoomUpdate(roomId, room);
            logger.info(`Player ${playerId} removed from room due to disconnect`);
          } catch (error) {
            logger.error(`Error removing player ${playerId}: ${error}`);
          } finally {
            this.socketToPlayerMap.delete(socket.id);
            this.socketToRoomMap.delete(socket.id);
          }
        }
      });
    });
  }

  public emitRoomUpdate(roomId: string, room: any) {
    this.io.to(roomId).emit("roomUpdated", room);
    logger.debug(`Room ${roomId} updated and broadcasted to clients`);
  }
}