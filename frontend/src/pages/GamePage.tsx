import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GameTable from "../components/GameTable";
import Game from "../domain/Game";
import { fetchGameData } from "../services/api";
import { Logger } from "../utils/Logger";

const GamePage: React.FC = () => {

  const logger = Logger.getInstance()

    const { roomId } = useParams<{ roomId: string }>();

  const [gameData, setGameData] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRoomData = async () => {
      try {
        const data: Game = await fetchGameData('TEST'); // Запрос к API
        setGameData(data);
      } catch (err) {

        if (err instanceof Error) {
          logger.error(`Error creating room: ${err.message}`);
          setError(err.message);
        } else {
          logger.error("An unexpected error occurred while creating room.");
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadRoomData();
  }, [roomId]);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;
  if (!gameData) return <div>Данные комнаты не найдены</div>;

  return <GameTable game={gameData} />;
};

export default GamePage;