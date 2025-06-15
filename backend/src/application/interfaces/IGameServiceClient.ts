import { Game } from "../../domain/Game";
import { Player } from "../../domain/Player";
import { Logger } from "../../utils/Logger";

const logger = Logger.getInstance();

export interface IGameServiceClient {
  createGame(roomId: string, players: Player[]): Promise<Game>;
  startRound(gameId: string): Promise<Game>;
}