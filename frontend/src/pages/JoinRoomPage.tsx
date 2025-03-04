import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { joinRoom, getOccupiedSeats, subscribeToRoomUpdates, unsubscribeFromRoomUpdates } from "../services/api";
import { Room } from "../domain/Room";
import { Logger } from "../utils/Logger"

const logger = Logger.getInstance();

const JoinRoomPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [username, setUsername] = useState("");
  const [seatNumber, setSeatNumber] = useState<number | null>(null);
  const [occupiedSeats, setOccupiedSeats] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOccupiedSeats = async () => {
      try {
        logger.info(`Fetching occupied seats for room: ${roomId}`);
        const seats = await getOccupiedSeats(roomId!);
        setOccupiedSeats(seats);
      } catch (err) {
        if (err instanceof Error) {
          logger.error(`Error fetching occupied seats: ${err.message}`);
          setError(err.message);
        } else {
          logger.error("An unexpected error occurred while fetching occupied seats.");
          setError("An unexpected error occurred.");
        }
      }
    };

    fetchOccupiedSeats();
  }, [roomId]);

  useEffect(() => {
    if (roomId) {
      subscribeToRoomUpdates("penging_" + roomId, "pending", (updatedRoom) => {
        setOccupiedSeats(updatedRoom.players.map((player: any) => player.seatNumber));
      });
    }
  }, [roomId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!seatNumber) {
      logger.warn("No seat number selected.");
      setError("Please select a seat");
      return;
    }

    try {
      logger.info(`Attempting to join room: ${roomId} with username: ${username} and seat: ${seatNumber}`);
      unsubscribeFromRoomUpdates(roomId!);
      const room: Room = await joinRoom(roomId!, username, seatNumber);
      localStorage.setItem("playerId", (room.players.find(player => player.username === username))?.id || "none");
      navigate(`/room/${roomId}`);
    } catch (err) {
      if (err instanceof Error) {
        logger.error(`Error joining room: ${err.message}`);
        setError(err.message);
      } else {
        logger.error("An unexpected error occurred while joining room.");
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div style={styles.container}>
      <h1>Join Room: {roomId}</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label htmlFor="username" style={styles.label}>
            Username:
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="seatNumber" style={styles.label}>
            Seat Number (1-7):
          </label>
          <select
            id="seatNumber"
            value={seatNumber || ""}
            onChange={(e) => setSeatNumber(Number(e.target.value))}
            required
            style={styles.input}
            disabled={occupiedSeats.length === 7}
          >
            <option value="" disabled>
              Select a seat
            </option>
            {[1, 2, 3, 4, 5, 6, 7].map((seat) => (
              <option key={seat} value={seat} disabled={occupiedSeats.includes(seat)}>
                Seat {seat} {occupiedSeats.includes(seat) ? "(Occupied)" : ""}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" style={styles.button}>
          Join
        </button>
        {error && <p style={styles.error}>{error}</p>}
      </form>
    </div>
  );
};

// Стили остаются без изменений
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  label: {
    fontSize: "16px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: "14px",
  },
};

export default JoinRoomPage;