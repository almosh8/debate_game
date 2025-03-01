// src/infrastructure/repositories/RoomRepository.ts
import { Room } from "../../domain/Room";
import { IRoomRepository } from "../../application/interfaces/IRoomRepository";
import { RedisClient } from "../RedisClient";
import { Logger } from "../Logger";

export class RoomRepository implements IRoomRepository {
  private logger: Logger = Logger.getInstance();

  constructor(private redisClient: RedisClient) {}

  async save(room: Room): Promise<void> {
    this.logger.debug(`Saving room: ${room.id}`);
    await this.redisClient.set(`room:${room.id}`, JSON.stringify(room));
    this.logger.debug(`Room saved: ${room.id}`);
  }

  async findById(roomId: string): Promise<Room | null> {
    this.logger.debug(`Fetching room: ${roomId}`);
    const data = await this.redisClient.get(`room:${roomId}`);
    this.logger.debug(`Room fetched: ${roomId}`);
    return data ? JSON.parse(data) : null;
  }
}