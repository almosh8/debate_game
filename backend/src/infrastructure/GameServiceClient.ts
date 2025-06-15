import { Game } from "../domain/Game";
import { Player } from "../domain/Player";
import { Logger } from "../utils/Logger";
import { Card } from "../domain/Card";

const logger = Logger.getInstance();

export class GameServiceClient {
  async createGame(roomId: string, players: Player[]): Promise<Game> {
    logger.info(`Creating game for room: ${roomId}`);
    
    // Определяем первого судью (обычно это администратор комнаты)
    const firstJudge = players.find(player => player.role === "admin") || players[0];
    
    // Создаем начальные карты (пустые массивы, будут заполнены при старте раунда)
    const initialPath1: Card[] = [];
    const initialPath2: Card[] = [];

    // Создаем новую игру
    const game = new Game(
      `game_${roomId}`, // ID игры
      roomId,           // ID комнаты
      1,                // Начинаем с 1 раунда
      players,          // Все игроки
      firstJudge.id,    // ID текущего судьи
      initialPath1,     // Путь 1 (пока пустой)
      initialPath2,     // Путь 2 (пока пустой)
      {                // Текущий ход
        seatNumber: 1,  // Начинает игрок с местом 1
        stage: "card_selection" // Начинаем с этапа выбора карт
      },
      60                // Таймер 60 секунд
    );

    logger.info(`Game created successfully for room: ${roomId}`);
    return game;
  }

  async startRound(gameId: string): Promise<Game> {
    logger.info(`Starting new round for game: ${gameId}`);
    // Здесь будет логика начала нового раунда
    // Пока возвращаем заглушку
    throw new Error("Not implemented yet");
  }
}