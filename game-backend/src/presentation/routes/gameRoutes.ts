import express from "express";
import { GameController } from "../controllers/GameController";

export const gameRoutes = (controller: GameController) => {
  const router = express.Router();
  router.get("/:roomId", controller.fetchGame.bind(controller));
  router.post("/:roomId/join", controller.joinGame.bind(controller));
  return router;
};
