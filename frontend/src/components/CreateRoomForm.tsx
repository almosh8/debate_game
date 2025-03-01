import React, { useState } from "react";
import { createRoom } from "../services/api";

const CreateRoomForm: React.FC = () => {
  const [adminId, setAdminId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      await createRoom(adminId);
      setSuccess(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
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
        {/* Окно с результатом запроса */}
        {(error || success) && (
          <div style={styles.resultWindow}>
            {error && <p style={styles.error}>{error}</p>}
            {success && <p style={styles.success}>Room created successfully!</p>}
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateRoomForm;

// Типизированные стили
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start", // Форма ближе к верху
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f0f0f0",
    paddingTop: "50px", // Уменьшенный отступ сверху
  },
  title: {
    fontSize: "48px",
    marginBottom: "20px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "400px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
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
  resultWindow: {
    marginTop: "20px",
    width: "100%",
    textAlign: "center",
  },
  error: {
    color: "red",
    fontSize: "18px",
  },
  success: {
    color: "green",
    fontSize: "18px",
  },
};