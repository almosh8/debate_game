import React from "react";
import PlayerSlot from "./PlayerSlot";

interface Player {
  id: string;
  username: string;
  cards: any[];
}

interface TeamProps {
  players: Player[];
  position: "top" | "bottom";
}

const Team: React.FC<TeamProps> = ({ players, position }) => {
  return (
    <div className={`team ${position}`}>
      {players.map((player) => (
        <PlayerSlot key={player.id} player={player} />
      ))}
    </div>
  );
};

export default Team;