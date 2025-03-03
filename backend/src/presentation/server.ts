// src/presentation/server.ts
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { DependencyContainer } from "../composition/DependencyContainer";
import dotenv from "dotenv";
import cors from "cors";
import { RemovePlayerUseCase } from "../application/useCases/RemovePlayerUseCase";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Разрешить все источники (для разработки)
  },
});

app.use(cors());
app.use(express.json());

// Инициализация зависимостей
const container = new DependencyContainer(io);
const roomController = container._getRoomController();
const removePlayerUseCase = new RemovePlayerUseCase(container["roomRepository"]); // Используем RemovePlayerUseCase

// Хранение связи между socket.id и playerId
const socketToPlayerMap = new Map<string, string>();

// Роуты
app.post("/rooms", (req, res) => roomController.createRoom(req, res));
app.get("/rooms/:roomId", (req, res) => roomController.getRoom(req, res));
app.post("/rooms/:roomId/join", (req, res) => roomController.joinRoom(req, res));
app.post("/rooms/:roomId/removePlayer", (req, res) => roomController.removePlayer(req, res));

// WebSocket: Отслеживание отключения пользователей
io.on("connection", (socket) => {
  console.log("A user connected");

  // Присоединение к комнате
  socket.on("joinRoom", (roomId: string, playerId: string) => {
    socket.join(roomId);
    socketToPlayerMap.set(socket.id, playerId); // Сохраняем связь между socket.id и playerId
    console.log(`User ${playerId} joined room: ${roomId}`);
  });

  // Отслеживание отключения пользователя
  socket.on("disconnect", async () => {
    console.log("A user disconnected");

    // Получаем playerId по socket.id
    const playerId = socketToPlayerMap.get(socket.id);
    if (playerId) {
      try {
        // Удаляем игрока из комнаты
        await removePlayerUseCase.execute(socketToPlayerMap.get(socket.id)!, playerId);
        console.log(`Player ${playerId} removed from room due to disconnect`);
      } catch (error) {
        console.error(`Error removing player ${playerId}:`, error);
      } finally {
        socketToPlayerMap.delete(socket.id); // Удаляем связь
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});