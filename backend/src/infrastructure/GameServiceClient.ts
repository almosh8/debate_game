// GameServiceClient.ts
import { Player } from "../domain/Player";
import { Logger } from "../utils/Logger";
import axios from "axios";
import { IGameServiceClient } from "../application/interfaces/IGameServiceClient";

const logger = Logger.getInstance();

interface CreateGameRequest {
  roomId: string;
  players: Player[];
  adminId: string;
}

export class GameServiceClient implements IGameServiceClient {
  private readonly GAME_SERVICE_URL = process.env.GAME_SERVICE_URL || "http://localhost:5001";

  async createGame(request: CreateGameRequest): Promise<any> {
    try {
      logger.info(`Creating game in Game Service for room: ${request.roomId}`);
      
      const response = await axios.post(`${this.GAME_SERVICE_URL}/games`, {
        roomId: request.roomId,
        players: request.players.map(player => ({
          id: player.id,
          username: player.username,
          role: player.role,
          seatNumber: player.seatNumber
        })),
        adminId: request.adminId
      });

      logger.info(`Game created successfully for room: ${request.roomId}`);
      return response.data;
    } catch (error) {
      logger.error(`Error creating game in Game Service: ${error}`);
      throw error;
    }
  }
}