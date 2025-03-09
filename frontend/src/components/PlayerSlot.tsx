import React from "react";
import { Player } from "../domain/Player";
import { Card } from "../domain/Card";

interface PlayerSlotProps {
  player: Player;
  card: Card | null;
}

const PlayerSlot: React.FC<PlayerSlotProps> = ({ player, card }) => {
  return (
    <div className="player-slot">
      <div className="player-info">
        <span>{player.username}</span>
      </div>
      <div className="card-slot">
        {card ? (
          <img src={card.imageUrl} alt={card.name} className="card-image" />
        ) : (
          <div className="empty-slot">Пустой слот</div>
        )}
      </div>
    </div>
  );
};

export default PlayerSlot;