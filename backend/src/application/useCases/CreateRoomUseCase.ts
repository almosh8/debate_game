// src/application/useCases/CreateRoomUseCase.ts
import { Room } from "../../domain/Room";
import { Player } from "../../domain/Player";
import { IRoomRepository } from "../interfaces/IRoomRepository";
import { Logger } from "../../utils/Logger";
import { v4 as uuid } from "uuid";

export class CreateRoomUseCase {
  private logger: Logger = Logger.getInstance();

  constructor(private roomRepository: IRoomRepository) {
    this.logger.info("CreateRoomUseCase initialized");
  }

  async execute(adminId: string, userIP: string): Promise<Room> {
    this.logger.info(`Attempt to create room by IP: ${userIP}`);

    // Создаем комнату с админом на Seat 1
    const room = new Room(uuid(), adminId, [], "waiting");
    const adminPlayer = new Player(uuid(), adminId, "admin", 1); // Админ на Seat 1
    room.players.push(adminPlayer);

    await this.roomRepository.save(room);
    this.logger.info(`Room created: ${room.id}`);
    return room;
  }
}