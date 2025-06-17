// src/tests/unit/CreateGameUseCase.test.ts
import { CreateGameUseCase } from "../../application/useCases/CreateGameUseCase";
import { IGameRepository } from "../../application/interfaces/IGameRepository";
import { Logger } from "../../infrastructure/Logger";

describe("CreateGameUseCase", () => {
  let createGameUseCase: CreateGameUseCase;
  let mockGameRepository: jest.Mocked<IGameRepository>;

  beforeEach(() => {
    mockGameRepository = {
      save: jest.fn(),
      findById: jest.fn(),
    };
    createGameUseCase = new CreateGameUseCase(mockGameRepository);

    jest.spyOn(Logger.getInstance(), "info").mockImplementation(() => {});
    jest.spyOn(Logger.getInstance(), "warn").mockImplementation(() => {});
  });

  it("should create a game if the user's IP is in the admin IP list", async () => {
    jest.spyOn(createGameUseCase, "isAdminIP").mockReturnValue(true);

    const adminId = "admin123";
    const game = await createGameUseCase.execute(adminId, "192.168.1.1");

    expect(game).toBeDefined();
    expect(game.id).toBeDefined();
    expect(game.adminId).toBe(adminId);
    expect(game.players).toEqual([]);
    expect(game.status).toBe("waiting");
  });

  it("should throw an error if the user's IP is not in the admin IP list", async () => {
    jest.spyOn(createGameUseCase, "isAdminIP").mockReturnValue(false);

    const adminId = "admin123";

    await expect(createGameUseCase.execute(adminId, "192.168.1.2")).rejects.toThrow(
      "Access denied: IP is not in the admin list"
    );
  });
});

