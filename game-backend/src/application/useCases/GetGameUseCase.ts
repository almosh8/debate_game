// src/application/useCases/GetGameUseCase.ts
import { Game } from "../../domain/Game";
import { IGameRepository } from "../interfaces/IGameRepository";
import { Logger } from "../../utils/Logger";
import { Card } from "../../domain/Card";
import { Player } from "../../domain/Player";

export class GetGameUseCase {
  private logger: Logger = Logger.getInstance();

  constructor(private GameRepository: IGameRepository) {
    this.logger.info("GetGameUseCase initialized");
  }

  async execute(gameId: string): Promise<Game | null> {
    this.logger.info(`Fetching game: ${gameId}`);
    try {

      if(gameId === 'TEST' || gameId === 'test') {
        const players: Player[] = [
    new Player("player1", "Игрок1", "admin", 1, [], "#FF5252"), // Красный
    new Player("player2", "Игрок2", "participant", 2, [], "#4CAF50"), // Зеленый
    new Player("player3", "Игрок3", "participant", 3, [], "#2196F3"), // Синий
    new Player("player4", "Игрок4", "participant", 4, [], "#FFC107"), // Желтый
    new Player("player5", "Игрок5", "participant", 5, [], "#9C27B0"), // Фиолетовый
    new Player("player6", "Игрок6", "participant", 6, [], "#00BCD4"), // Голубой
    new Player("player7", "Судья", "participant", 7, [], "#FF9800"), // Оранжевый
  ];

  // Фиктивные карты
  const cardsTop: Card[] = [
    new Card("good1", "good", "Малыш", "Невинный ребёнок.", "/good/1.jpg"),
    new Card("bad1", "bad", "Вор", "Крал у бедных.", "/bad/221.jpg"),
  ];

  const cardsBottom: Card[] = [
    new Card("good2", "good", "Малыш", "Невинный ребёнок.", "/good/2.jpg"),
    new Card("bad2", "bad", "Вор", "Крал у бедных.", "/bad/222.jpg"),
    new Card("secret2", "secret", "Мим-убийца", JSON.stringify({
      text: "Кажется безобидным.",
      playedOn: "good1" // Указываем, что эта карта сыграна на карту good1
    }), "/secrets/342.jpg"),
  ];

  // Создаём фиктивную игру
  const game = new Game(
    gameId, // ID комнаты
    players, // Список игроков
    "in_progress", // Статус игры
    "player7", // ID админа
    "player7", // ID текущего судьи
    cardsTop, // Карты на левом пути (path1)
    cardsBottom, // Карты на правом пути (path2)
    {
      seatNumber: 3, // Текущий ход игрока с seatNumber 3
      stage: "initial_argumentation" // Этап первичной аргументации
    },
    45, // Таймер: 45 секунд осталось
    1 // Текущий раунд
);
  this.logger.info(`Game fetched: ${gameId}`);
      return game;
      }

      const game = await this.GameRepository.findById(gameId);
      if (!game) {
        this.logger.warn(`Game not found: ${gameId}`);
        throw new Error("Game not found");
      }
      this.logger.info(`Game fetched: ${gameId}`);
      return game;
    } catch (error) {
      this.logger.error(`Error fetching game ${gameId}: ${error}`);
      throw error;
    }
  }
}

