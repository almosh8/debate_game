// src/application/interfaces/IRoomRepository.ts
import { Room } from "../../domain/Room";

export interface IRoomRepository {
  save(room: Room): Promise<void>;
  findById(roomId: string): Promise<Room | null>;
}