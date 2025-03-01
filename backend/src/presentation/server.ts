// src/presentation/server.ts
import express from "express";
import { RoomController } from "./controllers/RoomController";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const roomController = new RoomController();

app.post("/rooms", (req, res) => roomController.createRoom(req, res));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});