// src/application/useCases/RemovePlayerUseCase.ts
import { Room } from "../../domain/Room";
import { IRoomRepository } from "../interfaces/IRoomRepository";
import { Logger } from "../../utils/Logger";

export class RemovePlayerUseCase {
  private logger: Logger = Logger.getInstance();

  constructor(private roomRepository: IRoomRepository) {
    this.logger.info("RemovePlayerUseCase initialized");
  }

  async execute(roomId: string, playerId: string): Promise<Room> {
    this.logger.info(`Removing player: ${playerId} from room: ${roomId}`);

    const room = await this.roomRepository.findById(roomId);
    if (!room) {
      throw new Error("Room not found");
    }

    // Удаляем игрока
    room.removePlayer(playerId);

    // Сохраняем обновленную комнату
    await this.roomRepository.save(room);

    this.logger.info(`Player removed: ${playerId}`);
    return room;
  }
}