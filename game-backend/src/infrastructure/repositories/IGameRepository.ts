import { IGameRepository } from "../../domain/interfaces/IGameRepository";
import { Game } from "../../domain/Game";
import { Player } from "../../domain/Player";
import { DatabaseClient } from "../database/DatabaseClient";
import { Logger } from "../../utils/Logger";

export class GameRepository implements IGameRepository {
  private readonly logger = Logger.getInstance();

  constructor(private readonly db: DatabaseClient) {}

  async fetchGame(roomId: string): Promise<Game> {
    try {
      const gameData = await this.db.get(`game:${roomId}`);
      if (!gameData) {
        throw new Error(`Game with roomId ${roomId} not found`);
      }
      return this.parseGameData(gameData);
    } catch (error) {
      this.logger.error(`Failed to fetch game ${roomId}`, error as Error);
      throw error;
    }
  }

  async joinGame(roomId: string, player: Player): Promise<Game> {
    try {
      const game = await this.fetchGame(roomId);
      if (game.players.some(p => p.id === player.id)) {
        throw new Error(`Player ${player.id} already exists in game ${roomId}`);
      }
      game.players.push(player);
      await this.saveGame(game);
      return game;
    } catch (error) {
      this.logger.error(`Failed to join game ${roomId}`, error as Error);
      throw error;
    }
  }

  async disconnectPlayer(roomId: string, playerId: string): Promise<Game> {
    try {
      const game = await this.fetchGame(roomId);
      const initialCount = game.players.length;
      game.players = game.players.filter(p => p.id !== playerId);
      
      if (game.players.length === initialCount) {
        this.logger.warn(`Player ${playerId} not found in game ${roomId}`);
      }
      
      await this.saveGame(game);
      return game;
    } catch (error) {
      this.logger.error(`Failed to disconnect player ${playerId}`, error as Error);
      throw error;
    }
  }

  async saveGame(game: Game): Promise<void> {
    try {
      await this.db.set(`game:${game.roomId}`, JSON.stringify(game));
    } catch (error) {
      this.logger.error(`Failed to save game ${game.roomId}`, error as Error);
      throw error;
    }
  }

  private parseGameData(gameData: string): Game {
    try {
      const parsed = JSON.parse(gameData);
      // Здесь можно добавить валидацию структуры игры
      return parsed as Game;
    } catch (error) {
      throw new Error(`Invalid game data format: ${(error as Error).message}`);
    }
  }
}