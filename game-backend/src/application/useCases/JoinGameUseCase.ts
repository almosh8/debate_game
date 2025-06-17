// src/application/useCases/JoinGameUseCase.ts
import { v4 as uuid } from "uuid"; // Импортируем uuid
import { Game } from "../../domain/Game";
import { Player } from "../../domain/Player";
import { IGameRepository } from "../interfaces/IGameRepository";
import { Logger } from "../../utils/Logger";

export class JoinGameUseCase {
  private logger: Logger = Logger.getInstance();

  constructor(private GameRepository: IGameRepository) {
    this.logger.info("JoinGameUseCase initialized");
  }

  async execute(gameId: string, username: string, seatNumber: number): Promise<Game> {
    this.logger.info(`Joining game: ${gameId}, username: ${username}, seat: ${seatNumber}`);

    const game = await this.GameRepository.findById(gameId);
    if (!game) {
      throw new Error("Game not found");
    }

    // Проверяем, свободно ли место
    if (game.players.some((player) => player.seatNumber === seatNumber)) {
      throw new Error("Seat is already taken");
    }

    // Создаем игрока
    const player = new Player(uuid(), username, "participant", seatNumber); // Используем uuid
    game.players.push(player);

    // Сохраняем обновленную комнату
    await this.GameRepository.save(game);

    this.logger.info(`Player joined game: ${gameId}, seat: ${seatNumber}`);
    return game;
  }

  async getOccupiedSeats(gameId: string): Promise<number[]> {
    const game = await this.GameRepository.findById(gameId);
    if (!game) {
      throw new Error("Game not found");
    }
    return game.players.map((player) => player.seatNumber); // Возвращаем занятые места
  }
}

