import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { DependencyContainer } from "../composition/DependencyContainer";
import dotenv from "dotenv";
import cors from "cors";
import { GameSocketHandler } from "../infrastructure/web/GameSocketHandler";
import { Logger } from "../utils/Logger";

const logger = Logger.getInstance();
dotenv.config();

const app = express();
const server = createServer(app);

// Настройка Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST"],
    credentials: true
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000, // 2 минуты
    skipMiddlewares: true
  }
});

app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Инициализация зависимостей
const container = new DependencyContainer();
const gameController = container.getGameController();
const fetchGameUseCase = container.getFetchGameUseCase();
const joinGameUseCase = container.getJoinGameUseCase();

// Инициализация обработчика сокетов
new GameSocketHandler(io, fetchGameUseCase, joinGameUseCase);

// Маршруты API
app.get("/api/game/:roomId", (req, res) => gameController.fetchGame(req, res));
app.post("/api/game/:roomId/join", (req, res) => gameController.joinGame(req, res));

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "game-service",
    timestamp: new Date().toISOString()
  });
});

// Обработка ошибок
app.use((err: any, req: any, res: any, next: any) => {
  logger.error(`API Error: ${err.stack}`);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.GAME_SERVICE_PORT || 5001;
server.listen(PORT, () => {
  logger.info(`Game Service started on port ${PORT}`);
  logger.info(`CORS configured for: ${process.env.CORS_ORIGIN || "all origins"}`);
});