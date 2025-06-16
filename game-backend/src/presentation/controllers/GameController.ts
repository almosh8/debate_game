import { Request, Response } from "express";
import { GameService } from "../../application/services/GameService";

export class GameController {
  constructor(private gameService: GameService) {}

  async fetchGame(req: Request, res: Response) {
    try {
      const { roomId } = req.params;
      const game = await this.gameService.fetchGame(roomId);
      res.json(game);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch game" });
    }
  }

  async joinGame(req: Request, res: Response) {
    try {
      const { roomId } = req.params;
      const player = req.body;
      const game = await this.gameService.joinGame(roomId, player);
      res.json(game);
    } catch (error) {
      res.status(500).json({ error: "Failed to join game" });
    }
  }
}
