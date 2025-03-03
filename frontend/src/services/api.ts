// src/services/api.ts
import axios from "axios";
import { io, Socket } from "socket.io-client";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

console.log("API_BASE_URL:", API_BASE_URL);

// Создание комнаты
export const createRoom = async (adminId: string) => {
  console.log("Creating room with adminId:", adminId);
  try {
    const response = await axios.post(`${API_BASE_URL}/rooms`, { adminId });
    console.log("Room created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating room:", error);
    throw error;
  }
};

// Получение информации о комнате
export const getRoom = async (roomId: string) => {
  console.log("Fetching room:", roomId);
  try {
    const response = await axios.get(`${API_BASE_URL}/rooms/${roomId}`);
    console.log("Room fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching room:", error);
    throw error;
  }
};

// Получение списка комнат
export const getRooms = async () => {
  console.log("Fetching rooms...");
  try {
    const response = await axios.get(`${API_BASE_URL}/rooms`);
    console.log("Rooms fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching rooms:", error);
    throw error;
  }
};

// Получение занятых мест
export const getOccupiedSeats = async (roomId: string) => {
  console.log("Fetching occupied seats for room:", roomId);
  try {
    const room = await getRoom(roomId); // Используем getRoom для получения данных о комнате
    const occupiedSeats = room.players.map((player: any) => player.seatNumber); // Извлекаем занятые места
    console.log("Occupied seats fetched successfully:", occupiedSeats);
    return occupiedSeats;
  } catch (error) {
    console.error("Error fetching occupied seats:", error);
    throw error;
  }
};

// Присоединение к комнате
export const joinRoom = async (roomId: string, username: string, seatNumber: number) => {
  console.log("Joining room:", roomId, "with username:", username, "seat:", seatNumber);
  try {
    const response = await axios.post(`${API_BASE_URL}/rooms/${roomId}/join`, { username, seatNumber });
    console.log("Joined room successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error joining room:", error);
    throw error;
  }
};

// Инициализация WebSocket
let socket: Socket | null = null;

export const initSocket = () => {
  if (!socket) {
    socket = io(API_BASE_URL);
    console.log("WebSocket connected");
  }
  return socket;
};

// Подписка на обновления комнаты
export const subscribeToRoomUpdates = (roomId: string, callback: (room: any) => void) => {
  const socket = initSocket();
  socket.emit("joinRoom", roomId);
  socket.on("roomUpdated", callback);
  console.log("Subscribed to room updates:", roomId);
};

// Отписка от обновлений комнаты
export const unsubscribeFromRoomUpdates = (roomId: string) => {
  if (socket) {
    socket.off("roomUpdated");
    socket.emit("leaveRoom", roomId);
    console.log("Unsubscribed from room updates:", roomId);
  }
};