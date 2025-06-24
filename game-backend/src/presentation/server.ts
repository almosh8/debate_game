// src/main.ts
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
    origin: "*", // Allow all origins (for development)
  },
});

app.use(cors());
app.use(express.json());

// Initialize dependencies
const container = new DependencyContainer(io);
const gameController = container._getGameController();
const removePlayerUseCase = container.getRemovePlayerUseCase();
const startGameUseCase = container.getStartGameUseCase();

// Initialize socket handler
const socketHandler = new SocketHandler(io, removePlayerUseCase, startGameUseCase);
socketHandler.initialize();

// Routes
app.post("/games", (req, res) => gameController.createGame(req, res));
app.get("/games/:gameId", (req, res) => gameController.getGame(req, res));
//app.post("/games/:gameId/join", (req, res) => gameController.joinGame(req, res));
//app.post("/games/:gameId/remove-player", (req, res) => gameController.removePlayer(req, res));
//app.post("/games/:gameId/start", (req, res) => gameController.startGame(req, res));

const PORT = process.env.PORT || 5001; // Изменен порт для game service
server.listen(PORT, () => {
  console.log(`Game service running on port ${PORT}`);
});