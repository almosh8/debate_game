import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRoom, subscribeToRoomUpdates, removePlayer, initSocket, disconnectSocket, startGame } from '../services/RoomApi';
import { Logger } from '../utils/Logger';
import { Socket } from 'socket.io-client';

const logger = Logger.getInstance();

interface RoomPageStyles {
  container: React.CSSProperties;
  title: React.CSSProperties;
  statusContainer: React.CSSProperties;
  statusTitle: React.CSSProperties;
  statusBadge: React.CSSProperties;
  linkContainer: React.CSSProperties;
  sectionTitle: React.CSSProperties;
  linkInputContainer: React.CSSProperties;
  linkInput: React.CSSProperties;
  copyButton: React.CSSProperties;
  copiedText: React.CSSProperties;
  startGameContainer: React.CSSProperties;
  startButton: React.CSSProperties;
  loadingText: React.CSSProperties;
  playersContainer: React.CSSProperties;
  playersList: React.CSSProperties;
  playerItem: React.CSSProperties;
  playerName: React.CSSProperties;
  removeButton: React.CSSProperties;
  errorContainer: React.CSSProperties;
  loadingContainer: React.CSSProperties;
}

const styles: RoomPageStyles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  },
  title: {
    textAlign: 'center',
    color: '#1890ff',
    marginBottom: '24px'
  },
  statusContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '24px',
    padding: '12px',
    backgroundColor: '#fff',
    borderRadius: '6px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  },
  statusTitle: {
    margin: '0 12px 0 0',
    fontSize: '16px'
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '14px'
  },
  linkContainer: {
    marginBottom: '24px',
    padding: '16px',
    backgroundColor: '#fff',
    borderRadius: '6px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  },
  sectionTitle: {
    fontSize: '16px',
    marginBottom: '12px',
    color: '#333'
  },
  linkInputContainer: {
    display: 'flex',
    gap: '8px'
  },
  linkInput: {
    flex: 1,
    padding: '8px 12px',
    border: '1px solid #d9d9d9',
    borderRadius: '4px',
    fontSize: '14px',
    cursor: 'pointer'
  },
  copyButton: {
    width: '100px',
    padding: '8px 12px',
    backgroundColor: '#f0f0f0',
    border: '1px solid #d9d9d9',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  copiedText: {
    display: 'block',
    marginTop: '8px',
    color: '#52c41a',
    fontSize: '12px'
  },
  startGameContainer: {
    marginBottom: '24px',
    textAlign: 'center'
  },
  startButton: {
    backgroundColor: '#52c41a',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  loadingText: {
    marginTop: '8px',
    color: '#1890ff',
    fontSize: '14px'
  },
  playersContainer: {
    padding: '16px',
    backgroundColor: '#fff',
    borderRadius: '6px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  },
  playersList: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  playerItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid #f0f0f0'
  },
  playerName: {
    fontSize: '14px'
  },
  removeButton: {
    fontSize: '12px',
    backgroundColor: '#ff4d4f',
    color: 'white',
    border: 'none',
    padding: '4px 8px',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  errorContainer: {
    padding: '20px',
    color: '#f5222d',
    textAlign: 'center'
  },
  loadingContainer: {
    padding: '20px',
    textAlign: 'center'
  }
};

const RoomPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<any>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isStartingGame, setIsStartingGame] = useState(false);

  useEffect(() => {
    const newSocket = initSocket();
    setSocket(newSocket);
    setCurrentPlayerId(localStorage.getItem('playerId'));

    return () => {
      if (newSocket) {
        disconnectSocket(newSocket);
      }
    };
  }, []);

  useEffect(() => {
    const fetchRoom = async () => {
      if (!socket || !roomId) return;

      try {
        logger.info(`Fetching room: ${roomId}`);
        const roomData = await getRoom(roomId, socket);
        setRoom(roomData);
        setPlayers(roomData.players);
      } catch (err) {
        if (err instanceof Error) {
          logger.error(`Error fetching room: ${err.message}`);
          setError(err.message);
        } else {
          logger.error("An unexpected error occurred while fetching room.");
          setError("An unexpected error occurred.");
        }
      }
    };

    fetchRoom();
  }, [roomId, socket]);

  useEffect(() => {
    if (!socket || !roomId || !currentPlayerId) return;

    socket.emit("joinRoom", roomId, currentPlayerId);
    logger.info(`Player ${currentPlayerId} joined room ${roomId}`);

    const handleRoomUpdate = (updatedRoom: any) => {
      setRoom(updatedRoom);
      setPlayers(updatedRoom.players);
    };

    subscribeToRoomUpdates(roomId, currentPlayerId, (updatedRoom) => {
      setRoom(updatedRoom);
      setPlayers(updatedRoom.players);
      logger.info("Room change handled.");
      console.log(updatedRoom)
    }, socket);
    
    return () => {
      socket.off("roomUpdated", handleRoomUpdate);
    };
  }, [roomId, currentPlayerId, socket, navigate]);

  const handleRemovePlayer = async (playerId: string) => {
    if (!socket || !roomId) return;

    try {
      logger.info(`Attempting to remove player: ${playerId} from room: ${roomId}`);
      await removePlayer(roomId, playerId, socket);
    } catch (err) {
      if (err instanceof Error) {
        logger.error(`Error removing player: ${err.message}`);
        alert(err.message);
      } else {
        logger.error("An unexpected error occurred while removing player.");
        alert("An unexpected error occurred.");
      }
    }
  };

  const handleStartGame = async () => {
    if (!roomId || !socket) return;
    
    setIsStartingGame(true);
    try {
      const result = await startGame(roomId, socket);
      if (result.success) {
        alert('Игра начинается...');
      } else {
        alert(result.error || 'Не удалось начать игру');
      }
    } catch (err) {
      alert('Ошибка при запуске игры');
      logger.error(`Error starting game: ${err}`);
    } finally {
      setIsStartingGame(false);
    }
  };

  const copyLinkToClipboard = () => {
    const link = `${window.location.origin}/join/${roomId}`;
    navigator.clipboard.writeText(link)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(() => {
        logger.error("Failed to copy link to clipboard.");
        setError("Failed to copy link to clipboard.");
      });
  };

  if (error) {
    return <div style={styles.errorContainer}>{error}</div>;
  }

  if (!room) {
    return <div style={styles.loadingContainer}>Loading...</div>;
  }

  const isAdmin = room.adminId === currentPlayerId;
  const canStartGame = isAdmin && players.length >= 3 && room.status === 'waiting';

  if(room.status === "entering") {
    navigate(`/game/${room.roomId}`) //roomId the same as gameId
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Комната: {room.id}</h1>
      
      <div style={styles.statusContainer}>
        <h2 style={styles.statusTitle}>Статус:</h2>
        <div style={{
          ...styles.statusBadge,
          backgroundColor: room.status === 'waiting' ? '#faad14' : 
                          room.status === 'starting' ? '#1890ff' : '#52c41a'
        }}>
          {room.status === 'waiting' ? 'Ожидание игроков' : 
           room.status === 'starting' ? 'Начинаем игру...' : 'Игра идет'}
        </div>
      </div>

      <div style={styles.linkContainer}>
        <h2 style={styles.sectionTitle}>Пригласительная ссылка:</h2>
        <div style={styles.linkInputContainer}>
          <input
            type="text"
            value={`${window.location.origin}/join/${room.id}`}
            readOnly
            style={styles.linkInput}
            onClick={copyLinkToClipboard}
          />
          <button 
            onClick={copyLinkToClipboard}
            style={styles.copyButton}
          >
            Копировать
          </button>
        </div>
        {isCopied && <span style={styles.copiedText}>Скопировано!</span>}
      </div>

      {canStartGame && (
        <div style={styles.startGameContainer}>
          <button 
            onClick={handleStartGame}
            disabled={isStartingGame}
            style={{
              ...styles.startButton,
              opacity: isStartingGame ? 0.7 : 1,
              cursor: isStartingGame ? 'not-allowed' : 'pointer'
            }}
          >
            {isStartingGame ? 'Начинаем игру...' : 'Начать игру'}
          </button>
          {isStartingGame && (
            <p style={styles.loadingText}>Подготовка игры, пожалуйста подождите...</p>
          )}
        </div>
      )}

      <div style={styles.playersContainer}>
        <h2 style={styles.sectionTitle}>Игроки:</h2>
        <ul style={styles.playersList}>
          {players.map((player) => (
            <li key={player.id} style={styles.playerItem}>
              <span style={{
                ...styles.playerName,
                color: player.id === currentPlayerId ? '#52c41a' : '#333',
                fontWeight: player.id === currentPlayerId ? 'bold' : 'normal'
              }}>
                {player.username} (Место {player.seatNumber}) {player.id === currentPlayerId && "(Вы)"}
              </span>
              {room.adminId === currentPlayerId && player.id !== currentPlayerId && (
                <button 
                  onClick={() => handleRemovePlayer(player.id)} 
                  style={styles.removeButton}
                >
                  Удалить
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RoomPage;