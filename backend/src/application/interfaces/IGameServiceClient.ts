import { Game } from "../../domain/Game";
import { Player } from "../../domain/Player";

interface CreateGameRequest {
  roomId: string;
  players: Player[];
  adminId: string;
}

export interface IGameServiceClient {
  createGame(request: CreateGameRequest): Promise<any>;
}