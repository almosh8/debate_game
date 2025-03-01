// src/tests/integration/CreateRoomUseCase.integration.test.ts
import { CreateRoomUseCase } from "../../application/useCases/CreateRoomUseCase";
import { RoomRepository } from "../../infrastructure/repositories/RoomRepository";
import Redis from "ioredis-mock";
import { Logger } from "../../infrastructure/Logger";

describe("CreateRoomUseCase Integration Tests", () => {
  let createRoomUseCase: CreateRoomUseCase;
  let roomRepository: RoomRepository;
  let redisClient: any;

  beforeEach(() => {
    redisClient = new Redis();
    roomRepository = new RoomRepository(redisClient);
    createRoomUseCase = new CreateRoomUseCase(roomRepository);

    jest.spyOn(Logger.getInstance(), "info").mockImplementation(() => {});
    jest.spyOn(Logger.getInstance(), "warn").mockImplementation(() => {});
    jest.spyOn(Logger.getInstance(), "debug").mockImplementation(() => {});
  });

  it("should create a room and save it to Redis", async () => {
    jest.spyOn(createRoomUseCase, "isAdminIP").mockReturnValue(true);

    const adminId = "admin123";
    const userIP = "192.168.1.1";

    const room = await createRoomUseCase.execute(adminId, userIP);

    const savedRoom = await roomRepository.findById(room.id);
    expect(savedRoom).toBeDefined();
    expect(savedRoom?.id).toBe(room.id);
    expect(savedRoom?.adminId).toBe(adminId);
    expect(savedRoom?.players).toEqual([]);
    expect(savedRoom?.status).toBe("waiting");

    expect(Logger.getInstance().info).toHaveBeenCalledWith(
      expect.stringContaining("Attempt to create room by IP")
    );
    expect(Logger.getInstance().info).toHaveBeenCalledWith(
      expect.stringContaining("Room created")
    );
  });
});