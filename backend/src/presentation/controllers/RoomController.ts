// src/presentation/controllers/RoomController.ts
import { Request, Response } from "express";
import { CreateRoomUseCase } from "../../application/useCases/CreateRoomUseCase";
import { GetRoomUseCase } from "../../application/useCases/GetRoomUseCase";
import { JoinRoomUseCase } from "../../application/useCases/JoinRoomUseCase";
import { RemovePlayerUseCase } from "../../application/useCases/RemovePlayerUseCase";
import { Logger } from "../../utils/Logger";
import { SocketHandler } from "../socketHandler";

export class RoomController {
  private logger: Logger = Logger.getInstance();

  constructor(
    private createRoomUseCase: CreateRoomUseCase,
    private getRoomUseCase: GetRoomUseCase,
    private joinRoomUseCase: JoinRoomUseCase,
    private removePlayerUseCase: RemovePlayerUseCase, // Добавляем RemovePlayerUseCase
    private socketHandler: SocketHandler
  ) {
    this.logger.info("RoomController initialized");
  }

  async createRoom(req: Request, res: Response) {
    const { adminId } = req.body;
    const userIP = req.ip || "unknown";

    this.logger.info(`Request to create room by admin: ${adminId}, IP: ${userIP}`);

    try {
      const room = await this.createRoomUseCase.execute(adminId, userIP);
      this.socketHandler.emitRoomUpdate(room.id, room); // Отправляем обновление через WebSocket
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

  async getRoom(req: Request, res: Response) {
    const { roomId } = req.params;

    this.logger.info(`Request to fetch room: ${roomId}`);

    try {
      const room = await this.getRoomUseCase.execute(roomId);
      res.status(200).json(room);
      this.logger.info(`Room fetched successfully: ${roomId}`);
    } catch (error) {
      this.logger.error(`Error fetching room: ${error}`);
      if (error instanceof Error) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(404).json({ error: "An unexpected error occurred" });
      }
    }
  }

  async joinRoom(req: Request, res: Response) {
    const { roomId } = req.params;
    const { username, seatNumber } = req.body;

    this.logger.info(`Request to join room: ${roomId}, username: ${username}, seat: ${seatNumber}`);

    try {
      const room = await this.joinRoomUseCase.execute(roomId, username, seatNumber);
      this.socketHandler.emitRoomUpdate(room.id, room); // Отправляем обновление через WebSocket
      res.status(200).json(room);
      this.logger.info(`User joined room successfully: ${roomId}`);
    } catch (error) {
      this.logger.error(`Error joining room: ${error}`);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "An unexpected error occurred" });
      }
    }
  }

  async removePlayer(req: Request, res: Response) {
    const { roomId } = req.params;
    const { playerId } = req.body;

    this.logger.info(`Request to remove player: ${playerId} from room: ${roomId}`);

    try {
      const room = await this.removePlayerUseCase.execute(roomId, playerId);
      this.socketHandler.emitRoomUpdate(room.id, room); // Отправляем обновление через WebSocket
      res.status(200).json(room);
      this.logger.info(`Player removed successfully: ${playerId}`);
    } catch (error) {
      this.logger.error(`Error removing player: ${error}`);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "An unexpected error occurred" });
      }
    }
  }
}