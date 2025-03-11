import axios from "axios";
import { io, Socket } from "socket.io-client";
import { Logger } from "../utils/Logger";
import { Player } from "../domain/Player";
import Game from "../domain/Game";
import { Card } from "../domain/Card";

const logger = Logger.getInstance();

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

logger.info(`API_BASE_URL: ${API_BASE_URL}`);

export const fetchRoomData = async (roomId: string): Promise<Game> => {
  // Фиктивные данные для тестов
  const players: Player[] = [
    new Player("player1", "Игрок1", "admin", 1, []),
    new Player("player2", "Игрок2", "participant", 2, []),
    new Player("player3", "Игрок3", "participant", 3, []),
    new Player("player4", "Игрок4", "participant", 4, []),
    new Player("player5", "Игрок5", "participant", 5, []),
    new Player("player6", "Игрок6", "participant", 6, []),
    new Player("player7", "Судья", "participant", 7, []),
  ];

  // Фиктивные карты
  const cards: Card[] = [
    new Card("good1", "good", "Малыш", "Невинный ребёнок.", "/good/1.jpg"),
    new Card("bad1", "bad", "Вор", "Крал у бедных.", "/good/2.jpg"),
    new Card("secret1", "secret", "Мим-убийца", "Кажется безобидным.", "/bad/222.jpg"),
  ];

  // Распределяем карты по игрокам

  // Создаём фиктивную игру
  const game = new Game(
    "game123", // ID игры
    roomId, // ID комнаты
    1, // Текущий раунд
    players, // Список игроков
    "player7", // ID текущего судьи
    [cards[0]], // Карты на левом пути
    [cards[1], cards[2]] // Карты на правом пути
  );

  // Имитируем задержку сети
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return game;
};

export const createRoom = async (adminId: string) => {
  logger.info(`Creating room with adminId: ${adminId}`);
  try {
    const response = await axios.post(`${API_BASE_URL}/rooms`, { adminId });
    logger.info(`Room created successfully: ${JSON.stringify(response.data)}`);
    return response.data;
  } catch (error) {
    logger.error(`Error creating room: ${error}`);
    throw error;
  }
};

export const getRoom = async (roomId: string, socket: Socket) => {
  logger.info(`Fetching room: ${roomId}`);
  try {
    const response = await axios.get(`${API_BASE_URL}/rooms/${roomId}`);
    logger.info(`Room fetched successfully: ${JSON.stringify(response.data)}`);
    return response.data;
  } catch (error) {
    logger.error(`Error fetching room: ${error}`);
    throw error;
  }
};

export const getRooms = async () => {
  logger.info("Fetching rooms...");
  try {
    const response = await axios.get(`${API_BASE_URL}/rooms`);
    logger.info(`Rooms fetched successfully: ${JSON.stringify(response.data)}`);
    return response.data;
  } catch (error) {
    logger.error(`Error fetching rooms: ${error}`);
    throw error;
  }
};

export const getOccupiedSeats = async (roomId: string, socket: Socket) => {
  logger.info(`Fetching occupied seats for room: ${roomId}`);
  try {
    const room = await getRoom(roomId, socket);
    const occupiedSeats = room.players.map((player: any) => player.seatNumber);
    logger.info(`Occupied seats fetched successfully: ${occupiedSeats}`);
    return occupiedSeats;
  } catch (error) {
    logger.error(`Error fetching occupied seats: ${error}`);
    throw error;
  }
};

export const joinRoom = async (roomId: string, username: string, seatNumber: number, socket: Socket) => {
  logger.info(`Joining room: ${roomId} with username: ${username} and seat: ${seatNumber}`);
  try {
    const response = await axios.post(`${API_BASE_URL}/rooms/${roomId}/join`, { username, seatNumber });
    logger.info(`Joined room successfully: ${JSON.stringify(response.data)}`);
    return response.data;
  } catch (error) {
    logger.error(`Error joining room: ${error}`);
    throw error;
  }
};

export const removePlayer = async (roomId: string, playerId: string, socket: Socket) => {
  logger.info(`Removing player: ${playerId} from room: ${roomId}`);
  try {
    const response = await axios.post(`${API_BASE_URL}/rooms/${roomId}/removePlayer`, { playerId });
    logger.info(`Player removed successfully: ${JSON.stringify(response.data)}`);
    return response.data;
  } catch (error) {
    logger.error(`Error removing player: ${error}`);
    throw error;
  }
};

export const initSocket = () => {
  const socket = io(API_BASE_URL);
  logger.info("WebSocket connected");
  return socket;
};

export const subscribeToRoomUpdates = (roomId: string, playerId: string, callback: (room: any) => void, socket: Socket) => {
  if (!roomId || !playerId) return;

  socket.on("roomUpdated", callback);
  logger.info(`Subscribed to room updates: ${roomId}`);

  socket.on("connect_error", (err) => {
    logger.error(`Connection error: ${err}`);
  });

  socket.on("error", (err) => {
    logger.error(`WebSocket error: ${err}`);
  });
};

export const unsubscribeFromRoomUpdates = (roomId: string, socket: Socket) => {
  if (socket) {
    socket.off("roomUpdated");
    socket.emit("leaveRoom", roomId);
    logger.info(`Unsubscribed from room updates: ${roomId}`);
  }
};

export const disconnectSocket = (socket: Socket) => {
  if (socket) {
    socket.disconnect();
    logger.info("WebSocket disconnected");
    console.trace();
  }
};