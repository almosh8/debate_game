// src/presentation/controllers/RoomController.ts
import { Request, Response } from "express";
import { CreateRoomUseCase } from "../../application/useCases/CreateRoomUseCase";
import { Logger } from "../../utils/Logger";

export class RoomController {
  private logger: Logger = Logger.getInstance();

  constructor(private createRoomUseCase: CreateRoomUseCase) {
    this.logger.info("RoomController initialized");
  }

  async createRoom(req: Request, res: Response) {
    const { adminId } = req.body;
    const userIP = req.ip || "unknown";

    this.logger.info(`Request to create room by admin: ${adminId}, IP: ${userIP}`);

    try {
      const room = await this.createRoomUseCase.execute(adminId, userIP);
      res.status(201).json(room);
      this.logger.info(`Room created successfully: ${room.id}`);
    } catch (error) {
      this.logger.error(`Error creating room: ${error}`);
      if (error instanceof Error) {
        res.status(403).json({ error: error.message });
      } else {
        res.status(403).json({ error: "An unexpected error occurred" });
      }
    }
  }
}