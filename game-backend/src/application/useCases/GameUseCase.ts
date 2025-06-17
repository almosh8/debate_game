// src/application/useCases/GameUseCase.ts
import { IWebSocketClient } from "../interfaces/IWebSocketClient";
import { Game } from "../../domain/Game";
import { IGameRepository } from "../interfaces/IGameRepository";
import { v4 as uuid } from "uuid";

export class GameUseCase {
  constructor(
    private GameRepository: IGameRepository,
    private webSocketClient: IWebSocketClient
  ) {}

  async createGame(adminId: string): Promise<Game> {
    const game = new Game(uuid(), adminId, [], "waiting");
    await this.GameRepository.save(game);
    this.webSocketClient.joinGame(game.id); // Присоединяемся к комнате через WebSocket
    return game;
  }

}

