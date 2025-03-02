// src/presentation/controllers/GetRoomController.ts
import { Request, Response } from "express";
import { GetRoomUseCase } from "../../application/useCases/GetRoomUseCase";
import { Logger } from "../../utils/Logger";

export class GetRoomController {
  private logger: Logger = Logger.getInstance();

  constructor(private getRoomUseCase: GetRoomUseCase) {
    this.logger.info("GetRoomController initialized");
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
}