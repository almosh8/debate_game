import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom } from "../services/RoomApi";
import { Room } from "../domain/Room";
import { Logger } from "../utils/Logger"

const logger = Logger.getInstance();

const CreateRoomForm: React.FC = () => {
  const [adminId, setAdminId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      logger.info(`Attempting to create room with adminId: ${adminId}`);
      const room: Room = await createRoom(adminId);
      logger.info(`Room created successfully: ${room}`);
      localStorage.setItem("playerId", room.players[0].id);
      navigate(`/room/${room.id}`);
    } catch (err) {
      if (err instanceof Error) {
        logger.error(`Error creating room: ${err.message}`);
        setError(err.message);
      } else {
        logger.error("An unexpected error occurred while creating room.");
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Game Lobby</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label htmlFor="adminId" style={styles.label}>
            Admin ID:
          </label>
          <input
            id="adminId"
            type="text"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>
          Create
        </button>
        {error && <p style={styles.error}>{error}</p>}
      </form>
    </div>
  );
};

// Стили остаются без изменений
const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "flex-start",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f0f0f0",
    paddingTop: "50px",
  },
  title: {
    fontSize: "48px",
    marginBottom: "20px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    padding: "20px",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "400px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column" as const,
    marginBottom: "20px",
    width: "100%",
  },
  label: {
    fontSize: "20px",
    marginBottom: "10px",
  },
  input: {
    fontSize: "20px",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    width: "100%",
  },
  button: {
    fontSize: "20px",
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#007bff",
    color: "#ffffff",
    cursor: "pointer",
    width: "100%",
  },
  error: {
    color: "red",
    fontSize: "18px",
  },
};

export default CreateRoomForm;