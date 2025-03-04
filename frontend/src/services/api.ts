import axios from "axios";
import { io, Socket } from "socket.io-client";
import { Logger } from "../utils/Logger"

const logger = Logger.getInstance();

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

logger.info(`API_BASE_URL: ${API_BASE_URL}`);

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

export const getRoom = async (roomId: string) => {
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

export const getOccupiedSeats = async (roomId: string) => {
  logger.info(`Fetching occupied seats for room: ${roomId}`);
  try {
    const room = await getRoom(roomId);
    const occupiedSeats = room.players.map((player: any) => player.seatNumber);
    logger.info(`Occupied seats fetched successfully: ${occupiedSeats}`);
    return occupiedSeats;
  } catch (error) {
    logger.error(`Error fetching occupied seats: ${error}`);
    throw error;
  }
};

export const joinRoom = async (roomId: string, username: string, seatNumber: number) => {
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

export const removePlayer = async (roomId: string, playerId: string) => {
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

let socket: Socket | null = null;

export const initSocket = () => {
  if (!socket || !socket.connected) {
    socket = io(API_BASE_URL);
    logger.info("WebSocket connected");
  }
  return socket;
};

export const subscribeToRoomUpdates = (roomId: string, playerId: string, callback: (room: any) => void) => {
  if(!roomId || !playerId) return;
  
  const socket = initSocket();
  socket.on("roomUpdated", callback);
  logger.info(`Subscribed to room updates: ${roomId}`);

  socket.on("connect_error", (err) => {
    logger.error(`Connection error: ${err}`);
  });

  socket.on("error", (err) => {
    logger.error(`WebSocket error: ${err}`);
  });
};

export const unsubscribeFromRoomUpdates = (roomId: string) => {
  if (socket) {
    socket.off("roomUpdated");
    socket.emit("leaveRoom", roomId);
    logger.info(`Unsubscribed from room updates: ${roomId}`);
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    logger.info("WebSocket disconnected");
  }
};