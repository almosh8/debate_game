// src/game-service/application/interfaces/IGameRepository.ts
import { Game } from "../../domain/Game";
import { Player } from "../../domain/Player";

export interface IGameRepository {
  createGame(roomId: string, players: Player[]): Promise<Game>;
  findById(gameId: string): Promise<Game | null>;
}