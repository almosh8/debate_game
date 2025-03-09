import React from "react";
import PlayerSlot from "./PlayerSlot";
import { Player } from "../domain/Player";
import { Card } from "../domain/Card";

interface TeamProps {
  players: Player[];
  path: (Card | null)[];
  position: "top" | "bottom";
}

const Team: React.FC<TeamProps> = ({ players, path, position }) => {
  return (
    <div className={`team ${position}`}>
      {players.map((player, index) => (
        <PlayerSlot key={player.id} player={player} card={path[index]} />
      ))}
    </div>
  );
};

export default Team;