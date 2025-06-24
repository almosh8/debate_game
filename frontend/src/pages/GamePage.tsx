// pages/GamePage.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GameTable from "../components/GameTable";
import { Game } from "../domain/Game";
import { 
  fetchGameData, 
  initGameSocket, 
  subscribeToGameUpdates, 
  unsubscribeFromGameUpdates, 
  disconnectGameSocket,
  playCard,
  makeDecision
} from "../services/GameApi";
import { Logger } from "../utils/Logger";
import { Socket } from 'socket.io-client';


interface GamePageStyles {
  loading: React.CSSProperties;
  error: React.CSSProperties;
}

const styles: GamePageStyles = {
  
  loading: {
    textAlign: 'center',
    fontSize: '18px',
    padding: '40px'
  },
  error: {
    textAlign: 'center',
    color: '#ff4d4f',
    fontSize: '18px',
    padding: '40px'
  }
};

const GamePage: React.FC = () => {
  const logger = Logger.getInstance();
  const { gameId } = useParams<{ gameId: string }>();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentPlayerId] = useState(localStorage.getItem('playerId'));

  useEffect(() => {
    const loadGameData = async () => {
      try {
        logger.info(`gameId is ${gameId}`)
        const data = await fetchGameData(gameId || '');
        setGame(data);
        setError(null);
      } catch (err) {
        if (err instanceof Error) {
          logger.error(`Error loading game: ${err.message}`);
          setError(err.message);
        } else {
          logger.error("An unexpected error occurred while loading game.");
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    const gameSocket = initGameSocket();
    setSocket(gameSocket);

    loadGameData();

    return () => {
      if (gameSocket) {
        disconnectGameSocket(gameSocket);
      }
    };
  }, [gameId]);

  useEffect(() => {
    if (!socket || !gameId) return;

    const handleGameUpdate = (updatedGame: Game) => {
      setGame(updatedGame);
      logger.info("Game state updated");
    };

    subscribeToGameUpdates(gameId, handleGameUpdate, socket);

    return () => {
      unsubscribeFromGameUpdates(gameId, socket);
    };
  }, [socket, gameId]);

  const handlePlayCard = async (cardId: string, path: "path1" | "path2") => {
    if (!gameId || !currentPlayerId) return;
    
    try {
      const updatedGame = await playCard(gameId, currentPlayerId, cardId, path);
      setGame(updatedGame);
    } catch (err) {
      if (err instanceof Error) {
        logger.error(`Error playing card: ${err.message}`);
        alert(err.message);
      } else {
        logger.error("An unexpected error occurred while playing card.");
        alert("An unexpected error occurred.");
      }
    }
  };

  const handleMakeDecision = async (winningPath: "path1" | "path2") => {
    if (!gameId || !currentPlayerId || !game) return;
    
    try {
      // Проверяем, что текущий игрок - судья
      if (game.currentJudgeId !== currentPlayerId) {
        throw new Error("Only judge can make decisions");
      }
      
      const updatedGame = await makeDecision(gameId, currentPlayerId, winningPath);
      setGame(updatedGame);
    } catch (err) {
      if (err instanceof Error) {
        logger.error(`Error making decision: ${err.message}`);
        alert(err.message);
      } else {
        logger.error("An unexpected error occurred while making decision.");
        alert("An unexpected error occurred.");
      }
    }
  };

  if (loading) return <div style={styles.loading}>Загрузка игры...</div>;
  if (error) return <div style={styles.error}>{error}</div>;
  if (!game) return <div style={styles.error}>Данные игры не найдены</div>;

  console.log('GAME OBJECT\n', game)

  return (
    <div>
      <GameTable 
        game={game}
      />
    </div>
  );
};

export default GamePage;