// src/application/useCases/RoomUseCase.ts
import { IWebSocketClient } from "../interfaces/IWebSocketClient";
import { Room } from "../../domain/Room";
import { Player } from "../../domain/Player";
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

  async joinRoom(roomId: string, username: string): Promise<Room> {
    const room = await this.roomRepository.findById(roomId);
    if (!room) {
      throw new Error("Room not found");
    }
    const player = new Player(uuid(), username, "participant");
    room.players.push(player);
    await this.roomRepository.save(room);
    this.webSocketClient.joinRoom(room.id); // Присоединяемся к комнате через WebSocket
    return room;
  }

  subscribeToRoomUpdates(roomId: string, callback: (room: any) => void): void {
    this.webSocketClient.onRoomUpdated(callback);
  }

  unsubscribeFromRoomUpdates(roomId: string): void {
    this.webSocketClient.offRoomUpdated();
  }
}