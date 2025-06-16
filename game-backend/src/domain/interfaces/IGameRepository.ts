// src/domain/interfaces/IGameRepository.ts
import { Game } from "../Game";
import { Player } from "../Player";

/**
 * Интерфейс для работы с хранилищем игр
 */
export interface IGameRepository {
  /**
   * Получает игру по ID комнаты
   * @param roomId ID комнаты
   * @throws {Error} Если игра не найдена
   */
  fetchGame(roomId: string): Promise<Game>;

  /**
   * Добавляет игрока в игру
   * @param roomId ID комнаты
   * @param player Объект игрока
   * @throws {Error} Если игрок уже существует или игра не найдена
   */
  joinGame(roomId: string, player: Player): Promise<Game>;

  /**
   * Удаляет игрока из игры
   * @param roomId ID комнаты
   * @param playerId ID игрока
   * @throws {Error} Если игра не найдена
   */
  disconnectPlayer(roomId: string, playerId: string): Promise<Game>;

  /**
   * Сохраняет состояние игры
   * @param game Объект игры
   * @throws {Error} При ошибке сохранения
   */
  saveGame(game: Game): Promise<void>;

  /**
   * Создает новую игру (опционально)
   * @param game Объект игры
   * @throws {Error} Если игра уже существует
   */
  createGame?(game: Game): Promise<void>;

  /**
   * Удаляет игру (опционально)
   * @param roomId ID комнаты
   * @throws {Error} Если игра не найдена
   */
  deleteGame?(roomId: string): Promise<void>;
}