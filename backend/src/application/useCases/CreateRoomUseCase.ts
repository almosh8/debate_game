// src/application/useCases/CreateRoomUseCase.ts
import { Room } from "../../domain/Room";
import { IRoomRepository } from "../interfaces/IRoomRepository";
import { Logger } from "../../infrastructure/Logger";
import { v4 as uuid } from "uuid";

export class CreateRoomUseCase {
  private logger: Logger = Logger.getInstance();

  constructor(private roomRepository: IRoomRepository) {}

  private isAdminIP(ip: string): boolean {
    const adminIPs = process.env.ADMIN_IPS?.split(",") || [];
    return adminIPs.includes(ip);
  }

  async execute(adminId: string, userIP: string): Promise<Room> {
    this.logger.info(`Attempt to create room by IP: ${userIP}`);

    if (!this.isAdminIP(userIP)) {
      this.logger.warn(`Access denied for IP: ${userIP}`);
      throw new Error("Access denied: IP is not in the admin list");
    }

    const room = new Room(uuid(), adminId, [], "waiting");
    await this.roomRepository.save(room);
    this.logger.info(`Room created: ${room.id}`);
    return room;
  }
}