// src/application/useCases/JoinRoomUseCase.ts
import { v4 as uuid } from "uuid"; // Импортируем uuid
import { Room } from "../../domain/Room";
import { Player } from "../../domain/Player";
import { IRoomRepository } from "../interfaces/IRoomRepository";
import { Logger } from "../../utils/Logger";

export class JoinRoomUseCase {
  private logger: Logger = Logger.getInstance();

  constructor(private roomRepository: IRoomRepository) {
    this.logger.info("JoinRoomUseCase initialized");
  }

  async execute(roomId: string, username: string, seatNumber: number): Promise<Room> {
    this.logger.info(`Joining room: ${roomId}, username: ${username}, seat: ${seatNumber}`);

    const room = await this.roomRepository.findById(roomId);
    if (!room) {
      throw new Error("Room not found");
    }

    // Проверяем, свободно ли место
    if (room.players.some((player) => player.seatNumber === seatNumber)) {
      throw new Error("Seat is already taken");
    }

    // Создаем игрока
    const player = new Player(uuid(), username, "participant", seatNumber); // Используем uuid
    room.players.push(player);

    // Сохраняем обновленную комнату
    await this.roomRepository.save(room);

    this.logger.info(`Player joined room: ${roomId}, seat: ${seatNumber}`);
    return room;
  }

  async getOccupiedSeats(roomId: string): Promise<number[]> {
    const room = await this.roomRepository.findById(roomId);
    if (!room) {
      throw new Error("Room not found");
    }
    return room.players.map((player) => player.seatNumber); // Возвращаем занятые места
  }
}