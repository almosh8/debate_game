// StartGameUseCase.ts
import { IRoomRepository } from "../interfaces/IRoomRepository";
import { IGameServiceClient } from "../interfaces/IGameServiceClient";
import { Logger } from "../../utils/Logger";
import axios from "axios";

const logger = Logger.getInstance();

export class StartGameUseCase {
  constructor(
    private roomRepository: IRoomRepository,
    private gameServiceClient: IGameServiceClient
  ) {}

  async execute(roomId: string): Promise<{ 
    success: boolean; 
    room?: any;
    error?: string 
  }> {
    try {
      logger.info(`Starting game for room: ${roomId}`);
      
      // 1. Get room from repository
      const room = await this.roomRepository.findById(roomId);
      if (!room) {
        logger.warn(`Room not found: ${roomId}`);
        return { success: false, error: "Room not found" };
      }

      // 2. Validate room state
      if (room.status !== "waiting") {
        logger.warn(`Game already started for room: ${roomId}`);
        return { success: false, error: "Game already started", room };
      }

      if (room.players.length < 3) {
        logger.warn(`Not enough players to start game in room: ${roomId}`);
        return { 
          success: false, 
          error: "Not enough players to start (minimum 3)",
          room 
        };
      }

      // 3. Update room status to 'starting'
      room.status = "starting";
      await this.roomRepository.save(room);
      logger.info(`Room status updated to 'starting' for room: ${roomId}`);

      // 4. Create game in Game Service
      const game = await this.gameServiceClient.createGame({
        roomId,
        players: room.players,
        adminId: room.adminId
      });

      if (!game) {
        throw new Error("Failed to create game in Game Service");
      }

      // 5. Update room with game ID and new status
      room.status = "in_progress";
      await this.roomRepository.save(room);
      
      logger.info(`Game started successfully for room: ${roomId}`);
      return { 
        success: true, 
        room 
      };
    } catch (error) {
      logger.error(`Error starting game for room ${roomId}: ${error}`);
      
      // 6. Error handling - revert room status if possible
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
        error: error instanceof Error ? error.message : "Failed to start game",
        room: await this.roomRepository.findById(roomId)
      };
    }
  }
}