// src/presentation/controllers/GetGameController.ts
import { Request, Response } from "express";
import { GetGameUseCase } from "../../application/useCases/GetGameUseCase";
import { Logger } from "../../utils/Logger";

export class GetGameController {
  private logger: Logger = Logger.getInstance();

  constructor(private getGameUseCase: GetGameUseCase) {
    this.logger.info("GetGameController initialized");
  }

  async getGame(req: Request, res: Response) {
    const { gameId } = req.params;

    this.logger.info(`Request to fetch game: ${gameId}`);

    try {
      const game = await this.getGameUseCase.execute(gameId);
      res.status(200).json(game);
      this.logger.info(`Game fetched successfully: ${gameId}`);
    } catch (error) {
      this.logger.error(`Error fetching game: ${error}`);
      if (error instanceof Error) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(404).json({ error: "An unexpected error occurred" });
      }
    }
  }
}

