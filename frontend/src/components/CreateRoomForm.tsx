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
      // Type guard to check if err is an Error object
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Room</h2>
      <div>
        <label htmlFor="adminId">Admin ID:</label>
        <input
          id="adminId"
          type="text"
          value={adminId}
          onChange={(e) => setAdminId(e.target.value)}
          required
        />
      </div>
      <button type="submit">Create</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>Room created successfully!</p>}
    </form>
  );
};

export default CreateRoomForm;