// src/presentation/controllers/RoomController.ts
import { Request, Response } from "express";
import { CreateRoomUseCase } from "../../application/useCases/CreateRoomUseCase";
import { RoomRepository } from "../../infrastructure/repositories/RoomRepository";
import { RedisClient } from "../../infrastructure/RedisClient";

export class RoomController {
  private createRoomUseCase: CreateRoomUseCase;

  constructor() {
    const redisClient = new RedisClient();
    const roomRepository = new RoomRepository(redisClient);
    this.createRoomUseCase = new CreateRoomUseCase(roomRepository);
  }

  async createRoom(req: Request, res: Response) {
    const { adminId } = req.body;
    const userIP = req.ip;

    try {
      const room = await this.createRoomUseCase.execute(adminId, userIP);
      res.status(201).json(room);
    } catch (error) {
      res.status(403).json({ error: error.message });
    }
  }
}