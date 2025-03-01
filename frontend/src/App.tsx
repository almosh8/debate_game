// src/App.tsx
import React from "react";
import CreateRoomForm from "./components/CreateRoomForm";
import RoomList from "./components/RoomList";

const App: React.FC = () => {
  return (
    <div>
      <h1>Game Lobby</h1>
      <CreateRoomForm />
      <RoomList />
    </div>
  );
};

export default App;