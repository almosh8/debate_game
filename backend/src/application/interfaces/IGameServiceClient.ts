import { Game } from "../../domain/Game";
import { Player } from "../../domain/Player";

export interface IGameServiceClient {
  createGame(roomId: string, players: Player[]): Promise<Game>;
}