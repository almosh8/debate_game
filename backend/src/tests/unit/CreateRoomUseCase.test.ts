// src/tests/unit/CreateRoomUseCase.test.ts
import { CreateRoomUseCase } from "../../application/useCases/CreateRoomUseCase";
import { IRoomRepository } from "../../application/interfaces/IRoomRepository";
import { Logger } from "../../infrastructure/Logger";

describe("CreateRoomUseCase", () => {
  let createRoomUseCase: CreateRoomUseCase;
  let mockRoomRepository: jest.Mocked<IRoomRepository>;

  beforeEach(() => {
    mockRoomRepository = {
      save: jest.fn(),
      findById: jest.fn(),
    };
    createRoomUseCase = new CreateRoomUseCase(mockRoomRepository);

    jest.spyOn(Logger.getInstance(), "info").mockImplementation(() => {});
    jest.spyOn(Logger.getInstance(), "warn").mockImplementation(() => {});
  });

  it("should create a room if the user's IP is in the admin IP list", async () => {
    jest.spyOn(createRoomUseCase, "isAdminIP").mockReturnValue(true);

    const adminId = "admin123";
    const room = await createRoomUseCase.execute(adminId, "192.168.1.1");

    expect(room).toBeDefined();
    expect(room.id).toBeDefined();
    expect(room.adminId).toBe(adminId);
    expect(room.players).toEqual([]);
    expect(room.status).toBe("waiting");
  });

  it("should throw an error if the user's IP is not in the admin IP list", async () => {
    jest.spyOn(createRoomUseCase, "isAdminIP").mockReturnValue(false);

    const adminId = "admin123";

    await expect(createRoomUseCase.execute(adminId, "192.168.1.2")).rejects.toThrow(
      "Access denied: IP is not in the admin list"
    );
  });
});