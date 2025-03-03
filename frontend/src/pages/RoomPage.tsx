// src/pages/RoomPage.tsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getRoom, subscribeToRoomUpdates, unsubscribeFromRoomUpdates, removePlayer } from "../services/api";
import { initSocket } from "../services/api";

const RoomPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [room, setRoom] = useState<any>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false); // Состояние для уведомления "Скопировано"

  // Загрузка данных о комнате при первом рендере
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const roomData = await getRoom(roomId!);
        setRoom(roomData);
        setPlayers(roomData.players);
        setCurrentPlayerId(localStorage.getItem("playerId"));
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred.");
        }
      }
    };

    fetchRoom();
  }, [roomId]);

  // Подключение к WebSocket
  useEffect(() => {
    const socket = initSocket();
    const playerId = localStorage.getItem("playerId");
    console.log("player id is ", playerId);

    if (playerId && roomId) {
      socket.emit("joinRoom", roomId, playerId); // Отправляем playerId при подключении
    }

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  // Подписка на обновления комнаты
  useEffect(() => {
    if (roomId) {
      subscribeToRoomUpdates(roomId, (updatedRoom) => {
        setRoom(updatedRoom);
        setPlayers(updatedRoom.players);
      });
    }

    return () => {
      if (roomId) {
        unsubscribeFromRoomUpdates(roomId);
      }
    };
  }, [roomId]);

  // Удаление игрока
  const handleRemovePlayer = async (playerId: string) => {
    try {
      await removePlayer(roomId!, playerId);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  // Функция для копирования ссылки
  const copyLinkToClipboard = () => {
    const link = `${window.location.origin}/join/${roomId}`;
    navigator.clipboard
      .writeText(link)
      .then(() => {
        setIsCopied(true); // Показываем уведомление "Скопировано"
        setTimeout(() => setIsCopied(false), 2000); // Скрываем уведомление через 2 секунды
      })
      .catch(() => {
        setError("Failed to copy link to clipboard.");
      });
  };

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!room) {
    return <p>Loading...</p>;
  }

  return (
    <div style={styles.container}>
      <h1>Room: {room.id}</h1>
      <div style={styles.linkContainer}>
        <h2>Invite Link:</h2>
        <input
          type="text"
          value={`${window.location.origin}/join/${room.id}`}
          readOnly
          style={styles.linkInput}
          onClick={copyLinkToClipboard} // Копируем ссылку при клике
        />
        {isCopied && <p style={styles.copiedText}>Copied!</p>} {/* Уведомление "Скопировано" */}
      </div>
      <div style={styles.playersContainer}>
        <h2>Players:</h2>
        <ul>
          {players.map((player) => (
            <li
              key={player.id}
              style={{
                color: player.id === currentPlayerId ? "green" : "black",
              }}
            >
              {player.username} (Seat {player.seatNumber}) {player.id === currentPlayerId && "(You)"}
              {room.adminId === currentPlayerId && player.id !== currentPlayerId && ( // Кнопка удаления для админа
                <button onClick={() => handleRemovePlayer(player.id)} style={styles.removeButton}>
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
  },
  linkContainer: {
    marginBottom: "20px",
  },
  linkInput: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    cursor: "pointer", // Курсор в виде указателя
  },
  playersContainer: {
    marginTop: "20px",
  },
  removeButton: {
    marginLeft: "10px",
    padding: "5px 10px",
    backgroundColor: "red",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  copiedText: {
    color: "green",
    fontSize: "14px",
    marginTop: "5px",
  },
};

export default RoomPage;