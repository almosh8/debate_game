// src/tests/integration/CreateGameUseCase.integration.test.ts
import { CreateGameUseCase } from "../../application/useCases/CreateGameUseCase";
import { GameRepository } from "../../infrastructure/repositories/GameRepository";
import Redis from "ioredis-mock";
import { Logger } from "../../infrastructure/Logger";

describe("CreateGameUseCase Integration Tests", () => {
  let createGameUseCase: CreateGameUseCase;
  let GameRepository: GameRepository;
  let redisClient: any;

  beforeEach(() => {
    redisClient = new Redis();
    GameRepository = new GameRepository(redisClient);
    createGameUseCase = new CreateGameUseCase(GameRepository);

    jest.spyOn(Logger.getInstance(), "info").mockImplementation(() => {});
    jest.spyOn(Logger.getInstance(), "warn").mockImplementation(() => {});
    jest.spyOn(Logger.getInstance(), "debug").mockImplementation(() => {});
  });

  it("should create a game and save it to Redis", async () => {
    jest.spyOn(createGameUseCase, "isAdminIP").mockReturnValue(true);

    const adminId = "admin123";
    const userIP = "192.168.1.1";

    const game = await createGameUseCase.execute(adminId, userIP);

    const savedGame = await GameRepository.findById(game.id);
    expect(savedGame).toBeDefined();
    expect(savedGame?.id).toBe(game.id);
    expect(savedGame?.adminId).toBe(adminId);
    expect(savedGame?.players).toEqual([]);
    expect(savedGame?.status).toBe("waiting");

    expect(Logger.getInstance().info).toHaveBeenCalledWith(
      expect.stringContaining("Attempt to create game by IP")
    );
    expect(Logger.getInstance().info).toHaveBeenCalledWith(
      expect.stringContaining("Game created")
    );
  });
});

