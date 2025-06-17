// src/application/useCases/RoomUseCase.ts
import { IWebSocketClient } from "../interfaces/IWebSocketClient";
import { Room } from "../../domain/Room";
import { IRoomRepository } from "../interfaces/IRoomRepository";
import { v4 as uuid } from "uuid";

export class RoomUseCase {
  constructor(
    private roomRepository: IRoomRepository,
    private webSocketClient: IWebSocketClient
  ) {}

  async createRoom(adminId: string): Promise<Room> {
    const room = new Room(uuid(), adminId, [], "waiting");
    await this.roomRepository.save(room);
    this.webSocketClient.joinRoom(room.id); // Присоединяемся к комнате через WebSocket
    return room;
  }

}