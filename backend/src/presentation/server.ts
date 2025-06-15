import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { DependencyContainer } from "../composition/DependencyContainer";
import dotenv from "dotenv";
import cors from "cors";
import { SocketHandler } from "./socketHandler";

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
const gameController = container.getGameController();
const removePlayerUseCase = container.getRemovePlayerUseCase();
const startGameUseCase = container.getStartGameUseCase();

// Инициализация обработчика сокетов
const socketHandler = new SocketHandler(io, removePlayerUseCase, startGameUseCase);
socketHandler.initialize();

// Роуты
app.post("/rooms", (req, res) => roomController.createRoom(req, res));
app.get("/rooms/:roomId", (req, res) => roomController.getRoom(req, res));
app.post("/rooms/:roomId/join", (req, res) => roomController.joinRoom(req, res));
app.post("/rooms/:roomId/removePlayer", (req, res) => roomController.removePlayer(req, res));
app.post("/rooms/:roomId/start", (req, res) => gameController.startGame(req, res));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});