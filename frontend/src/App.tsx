// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateRoomForm from "./components/CreateRoomForm";
import RoomPage from "./pages/RoomPage";
import JoinRoomPage from "./pages/JoinRoomPage";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CreateRoomForm />} />
        <Route path="/room/:roomId" element={<RoomPage />} />
        <Route path="/join/:roomId" element={<JoinRoomPage />} /> {/* Маршрут для страницы входа */}
      </Routes>
    </Router>
  );
};

export default App;