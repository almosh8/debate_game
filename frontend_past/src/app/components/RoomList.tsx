// src/components/RoomList.tsx
import React from "react";
import useRooms from "../hooks/useRooms";

const RoomList: React.FC = () => {
  const { rooms, loading, error } = useRooms();

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Rooms</h2>
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>
            {room.id} - {room.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomList;