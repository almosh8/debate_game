// src/infrastructure/repositories/RoomRepository.ts
import { Room } from "../../domain/Room";
import { IRoomRepository } from "../../application/interfaces/IRoomRepository";
import { DatabaseClient } from "../DatabaseClient";
import { Logger } from "../../utils/Logger";

export class RoomRepository implements IRoomRepository {
  private logger: Logger = Logger.getInstance();

  constructor(private db: DatabaseClient) {
    this.logger.info("RoomRepository initialized");
  }

  async save(room: Room): Promise<void> {
    this.logger.debug(`Saving room: ${room.id}`);
    try {
      await this.db.set(`room:${room.id}`, JSON.stringify(room));
      this.logger.info(`Room saved: ${room.id}`);
    } catch (error) {
      this.logger.error(`Error saving room ${room.id}: ${error}`);
      throw error;
    }
  }

  async findById(roomId: string): Promise<Room | null> {
    this.logger.debug(`Fetching room: ${roomId}`);
    try {
      const data = await this.db.get(`room:${roomId}`);
      if (data) {
        this.logger.info(`Room fetched: ${roomId}`);
        return JSON.parse(data);
      } else {
        this.logger.warn(`Room not found: ${roomId}`);
        return null;
      }
    } catch (error) {
      this.logger.error(`Error fetching room ${roomId}: ${error}`);
      throw error;
    }
  }
}