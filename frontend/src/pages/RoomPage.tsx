import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getRoom, subscribeToRoomUpdates, removePlayer, initSocket, disconnectSocket } from "../services/api";
import { Socket } from "socket.io-client";
import { Logger } from "../utils/Logger";

const logger = Logger.getInstance();

const RoomPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [room, setRoom] = useState<any>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = initSocket();
    setSocket(newSocket);

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
        setCurrentPlayerId(localStorage.getItem("playerId"));
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
    if (!socket || !roomId) return;

    const playerId = localStorage.getItem("playerId");
    logger.info(`Player ID is: ${playerId}`);

    if (playerId) {
      socket.emit("joinRoom", roomId, playerId);
    }
  }, [roomId, socket]);

  useEffect(() => {
    if (!socket || !roomId || !currentPlayerId) return;

    logger.info(`Attempting to subscribeToRoomUpdates: roomId = ${roomId}; currentPlayerId ${currentPlayerId}; socket: ${socket.active}`);
    subscribeToRoomUpdates(roomId, currentPlayerId, (updatedRoom) => {
      setRoom(updatedRoom);
      setPlayers(updatedRoom.players);
      logger.info("Room change handled.");
    }, socket);
  }, [roomId, currentPlayerId, socket]);

  const handleRemovePlayer = async (playerId: string) => {
    if (!socket || !roomId) return;

    try {
      logger.info(`Attempting to remove player: ${playerId} from room: ${roomId}`);
      await removePlayer(roomId, playerId, socket);
    } catch (err) {
      if (err instanceof Error) {
        logger.error(`Error removing player: ${err.message}`);
        setError(err.message);
      } else {
        logger.error("An unexpected error occurred while removing player.");
        setError("An unexpected error occurred.");
      }
    }
  };

  const copyLinkToClipboard = () => {
    const link = `${window.location.origin}/join/${roomId}`;
    navigator.clipboard
      .writeText(link)
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
          onClick={copyLinkToClipboard}
        />
        {isCopied && <p style={styles.copiedText}>Copied!</p>}
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
              {room.adminId === currentPlayerId && player.id !== currentPlayerId && (
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
    cursor: "pointer",
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