// src/presentation/server.ts
import express from "express";
import { DependencyContainer } from "../composition/DependencyContainer";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors()); // Включаем CORS
app.use(express.json());

// Инициализация зависимостей через DependencyContainer
const container = new DependencyContainer();
const roomController = container._getRoomController(); // Получаем RoomController
const getRoomController = container.getGetRoomController(); // Получаем GetRoomController

// Роуты
app.post("/rooms", (req, res) => roomController.createRoom(req, res));
app.get("/rooms/:roomId", (req, res) => getRoomController.getRoom(req, res));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});