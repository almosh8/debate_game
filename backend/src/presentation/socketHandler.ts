import { Server, Socket } from "socket.io";
import { RemovePlayerUseCase } from "../application/useCases/RemovePlayerUseCase";
import { Logger } from "../utils/Logger"; // Импортируем Logger из shared

const logger = Logger.getInstance(); // Создаем экземпляр Logger

export class SocketHandler {
  private socketToPlayerMap = new Map<string, string>();
  private socketToRoomMap = new Map<string, string>();

  constructor(private io: Server, private removePlayerUseCase: RemovePlayerUseCase) {}

  public initialize() {
    this.io.on("connection", (socket: Socket) => {
      logger.info("A user connected"); // Логируем подключение пользователя

      // Присоединение к комнате
      socket.on("joinRoom", (roomId: string, playerId: string) => {
        socket.join(roomId);
        this.socketToPlayerMap.set(socket.id, playerId); // Сохраняем связь между socket.id и playerId
        this.socketToRoomMap.set(socket.id, roomId); // Сохраняем связь между socket.id и roomId
        logger.info(`User ${playerId} joined room: ${roomId}`); // Логируем присоединение к комнате
      });

      // Отслеживание отключения пользователя
      socket.on("disconnect", async () => {
        logger.info("A user disconnected"); // Логируем отключение пользователя

        // Получаем playerId по socket.id
        const playerId = this.socketToPlayerMap.get(socket.id);
        const roomId = this.socketToRoomMap.get(socket.id);
        if (playerId && roomId) {
          try {
            // Удаляем игрока из комнаты
              const room = await this.removePlayerUseCase.execute(roomId, playerId);
              this.emitRoomUpdate(roomId, room); // Отправляем обновление через WebSocket
              logger.info(`Player ${playerId} removed from room due to disconnect`); // Логируем удаление игрока
          } catch (error) {
            if (error instanceof Error) {
              logger.error(`Error removing player ${playerId}: ${error.message}`); // Логируем ошибку
            } else {
              logger.error(`Error removing player ${playerId}: An unexpected error occurred.`);
            }
          } finally {
            this.socketToPlayerMap.delete(socket.id); // Удаляем связь
            this.socketToRoomMap.delete(socket.id); // Удаляем связь
          }
        }
      });
    });
  }

  public emitRoomUpdate(roomId: string, room: any) {
    this.io.to(roomId).emit("roomUpdated", room);
    logger.debug(`Room ${roomId} updated and broadcasted to clients`); // Логируем обновление комнаты
  }
}