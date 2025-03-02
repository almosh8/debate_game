// src/application/useCases/GetRoomUseCase.ts
import { Room } from "../../domain/Room";
import { IRoomRepository } from "../interfaces/IRoomRepository";
import { Logger } from "../../utils/Logger";

export class GetRoomUseCase {
  private logger: Logger = Logger.getInstance();

  constructor(private roomRepository: IRoomRepository) {
    this.logger.info("GetRoomUseCase initialized");
  }

  async execute(roomId: string): Promise<Room | null> {
    this.logger.info(`Fetching room: ${roomId}`);
    try {
      const room = await this.roomRepository.findById(roomId);
      if (!room) {
        this.logger.warn(`Room not found: ${roomId}`);
        throw new Error("Room not found");
      }
      this.logger.info(`Room fetched: ${roomId}`);
      return room;
    } catch (error) {
      this.logger.error(`Error fetching room ${roomId}: ${error}`);
      throw error;
    }
  }
}