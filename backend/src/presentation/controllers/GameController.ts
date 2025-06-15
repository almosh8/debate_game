import { Request, Response } from "express";
import { StartGameUseCase } from "../../application/useCases/StartGameUseCase";
import { Logger } from "../../utils/Logger";

export class GameController {
  private logger: Logger = Logger.getInstance();

  constructor(private startGameUseCase: StartGameUseCase) {
    this.logger.info("GameController initialized");
  }

  async startGame(req: Request, res: Response) {
    const { roomId } = req.params;

    this.logger.info(`Request to start game in room: ${roomId}`);

    try {
      const result = await this.startGameUseCase.execute(roomId);
      
      if (result.success) {
        res.status(200).json({ success: true });
      } else {
        res.status(400).json({ success: false, error: result.error });
      }
    } catch (error) {
      this.logger.error(`Error starting game: ${error}`);
      if (error instanceof Error) {
        res.status(500).json({ 
          success: false, 
          error: error.message || "Internal server error" 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          error: "Internal server error" 
        });
      }
    }
  }
}