import { Server, Socket } from "socket.io";
import { RemovePlayerUseCase } from "../application/useCases/RemovePlayerUseCase";
import { StartGameUseCase } from "../application/useCases/StartGameUseCase";
import { Logger } from "../utils/Logger";

const logger = Logger.getInstance();

export class SocketHandler {
  private socketToPlayerMap = new Map<string, string>();
  private socketToGameMap = new Map<string, string>();

  constructor(
    private io: Server,
    private removePlayerUseCase: RemovePlayerUseCase,
    private startGameUseCase: StartGameUseCase
  ) {}

  public initialize() {
    this.io.on("connection", (socket: Socket) => {
      logger.info("A user connected");

      // Присоединение к комнате
      socket.on("joinGame", (gameId: string, playerId: string) => {
        socket.join(gameId);
        this.socketToPlayerMap.set(socket.id, playerId);
        this.socketToGameMap.set(socket.id, gameId);
        logger.info(`User ${playerId} joined game: ${gameId}`);
      });

      // Запрос на начало игры
      socket.on("startGame", async (gameId: string) => {
        logger.info(`Start game requested for game: ${gameId}`);
        try {
          await this.startGameUseCase.execute(gameId);
          
        } catch (error) {
          logger.error(`Error starting game: ${error}`);
        }
      });

      // Отслеживание отключения пользователя
      socket.on("disconnect", async () => {
        logger.info("A user disconnected");
        const playerId = this.socketToPlayerMap.get(socket.id);
        const gameId = this.socketToGameMap.get(socket.id);
        
        if (playerId && gameId) {
          try {
            const game = await this.removePlayerUseCase.execute(gameId, playerId);
            this.emitGameUpdate(gameId, game);
            logger.info(`Player ${playerId} removed from game due to disconnect`);
          } catch (error) {
            logger.error(`Error removing player ${playerId}: ${error}`);
          } finally {
            this.socketToPlayerMap.delete(socket.id);
            this.socketToGameMap.delete(socket.id);
          }
        }
      });
    });
  }

  public emitGameUpdate(gameId: string, game: any) {
    this.io.to(gameId).emit("gameUpdated", game);
    logger.debug(`Game ${gameId} updated and broadcasted to clients`);
  }
}
