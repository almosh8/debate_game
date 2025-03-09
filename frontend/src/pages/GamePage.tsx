import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GameTable from "../components/GameTable";
import Game from "../domain/Game";
//import { fetchRoomData } from "./services/api"; // Импорт функции для запроса к API

const GamePage: React.FC = () => {
    const { roomId } = useParams<{ roomId: string }>();

  const [gameData, setGameData] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRoomData = async () => {
      try {
        const data = await fetchRoomData(roomId); // Запрос к API
        setGameData(data);
      } catch (err) {
        setError("Ошибка при загрузке данных комнаты");
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