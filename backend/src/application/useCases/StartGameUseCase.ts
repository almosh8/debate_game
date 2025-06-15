import { IRoomRepository } from "../interfaces/IRoomRepository";
import { IGameServiceClient } from "../interfaces/IGameServiceClient";
import { IWebSocketClient } from "../interfaces/IWebSocketClient";
import { Logger } from "../../utils/Logger";

const logger = Logger.getInstance();

export class StartGameUseCase {
  constructor(
    private roomRepository: IRoomRepository,
    private gameServiceClient: IGameServiceClient,
    private webSocketClient: IWebSocketClient
  ) {}

  async execute(roomId: string): Promise<{ success: boolean; error?: string }> {
    try {
      logger.info(`Starting game for room: ${roomId}`);
      
      const room = await this.roomRepository.findById(roomId);
      if (!room) {
        logger.warn(`Room not found: ${roomId}`);
        return { success: false, error: "Room not found" };
      }

      if (room.status !== "waiting") {
        logger.warn(`Game already started for room: ${roomId}`);
        return { success: false, error: "Game already started" };
      }

      if (room.players.length < 3) {
        logger.warn(`Not enough players to start game in room: ${roomId}`);
        return { success: false, error: "Not enough players to start (minimum 3)" };
      }

      // Update room status
      room.status = "starting";
      await this.roomRepository.save(room);
      logger.info(`Room status updated to 'starting' for room: ${roomId}`);

      // Create game in Game Service
      const game = await this.gameServiceClient.createGame(roomId, room.players);
      logger.info(`Game created successfully for room: ${roomId}, gameId: ${game.id}`);

      // Notify all players
      this.webSocketClient.emitRoomUpdate(roomId, {
        ...room,
        status: "starting",
        gameId: game.id
      });
      logger.info(`Room update broadcasted for room: ${roomId}`);

      return { success: true };
    } catch (error) {
      logger.error(`Error starting game for room ${roomId}: ${error}`);
      
      // Try to revert room status if error occurred
      try {
        const room = await this.roomRepository.findById(roomId);
        if (room) {
          room.status = "waiting";
          await this.roomRepository.save(room);
          logger.info(`Reverted room status to 'waiting' for room: ${roomId}`);
        }
      } catch (revertError) {
        logger.error(`Failed to revert room status for room ${roomId}: ${revertError}`);
      }

      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to start game" 
      };
    }
  }
}