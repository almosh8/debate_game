// src/presentation/socketHandler.ts
import { Server, Socket } from "socket.io";
import { RemovePlayerUseCase } from "../application/useCases/RemovePlayerUseCase";

export class SocketHandler {
  private socketToPlayerMap = new Map<string, string>();

  constructor(private io: Server, private removePlayerUseCase: RemovePlayerUseCase) {}

  public initialize() {
    this.io.on("connection", (socket: Socket) => {
      console.log("A user connected");

      // Присоединение к комнате
      socket.on("joinRoom", (roomId: string, playerId: string) => {
        socket.join(roomId);
        this.socketToPlayerMap.set(socket.id, playerId); // Сохраняем связь между socket.id и playerId
        console.log(`User ${playerId} joined room: ${roomId}`);
      });

      // Отслеживание отключения пользователя
      socket.on("disconnect", async () => {
        console.log("A user disconnected");

        // Получаем playerId по socket.id
        const playerId = this.socketToPlayerMap.get(socket.id);
        if (playerId) {
          try {
            // Удаляем игрока из комнаты
            await this.removePlayerUseCase.execute(playerId, playerId);
            console.log(`Player ${playerId} removed from room due to disconnect`);
          } catch (error) {
            console.error(`Error removing player ${playerId}:`, error);
          } finally {
            this.socketToPlayerMap.delete(socket.id); // Удаляем связь
          }
        }
      });
    });
  }

  public emitRoomUpdate(roomId: string, room: any) {
    this.io.to(roomId).emit("roomUpdated", room);
  }
}