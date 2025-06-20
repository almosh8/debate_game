// services/GameApi.ts
import axios from "axios";
import { io, Socket } from "socket.io-client";
import { Logger } from "../utils/Logger";
import { Game } from "../domain/Game";
import { Card } from "../domain/Card";
import { Player } from "../domain/Player";

const logger = Logger.getInstance();
const API_BASE_URL = process.env.REACT_APP_API_GAME_URL || "http://localhost:5001";

export const fetchGameData = async (gameId: string): Promise<Game> => {
  logger.info(`Fetching game data for: ${gameId}`);
  try {
    const response = await axios.get(`${API_BASE_URL}/games/${gameId}`);
    return response.data;
  } catch (error) {
    logger.error(`Error fetching game data: ${error}`);
    throw error;
  }
};

export const playCard = async (
  gameId: string,
  playerId: string,
  cardId: string,
  path: "path1" | "path2"
): Promise<Game> => {
  logger.info(`Playing card ${cardId} to ${path} in game ${gameId}`);
  try {
    const response = await axios.post(`${API_BASE_URL}/games/${gameId}/play-card`, {
      playerId,
      cardId,
      path
    });
    return response.data;
  } catch (error) {
    logger.error(`Error playing card: ${error}`);
    throw error;
  }
};

export const makeDecision = async (
  gameId: string,
  judgeId: string,
  winningPath: "path1" | "path2"
): Promise<Game> => {
  logger.info(`Making decision for game ${gameId}, winning path: ${winningPath}`);
  try {
    const response = await axios.post(`${API_BASE_URL}/games/${gameId}/decision`, {
      judgeId,
      winningPath
    });
    return response.data;
  } catch (error) {
    logger.error(`Error making decision: ${error}`);
    throw error;
  }
};

export const initGameSocket = () => {
  const socket = io(API_BASE_URL, {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on('connect', () => {
    logger.info("Game WebSocket connected");
  });

  socket.on('disconnect', () => {
    logger.info("Game WebSocket disconnected");
  });

  socket.on('connect_error', (err) => {
    logger.error(`Game connection error: ${err}`);
  });

  return socket;
};

export const subscribeToGameUpdates = (
  gameId: string,
  callback: (game: Game) => void,
  socket: Socket
) => {
  if (!gameId) return;

  socket.on(`gameUpdated:${gameId}`, callback);
  logger.info(`Subscribed to game updates: ${gameId}`);

  socket.on("connect_error", (err) => {
    logger.error(`Game connection error: ${err}`);
  });
};

export const unsubscribeFromGameUpdates = (gameId: string, socket: Socket) => {
  if (socket) {
    socket.off(`gameUpdated:${gameId}`);
    logger.info(`Unsubscribed from game updates: ${gameId}`);
  }
};

export const disconnectGameSocket = (socket: Socket) => {
  if (socket) {
    socket.disconnect();
    logger.info("Game WebSocket disconnected");
  }
};