import React from "react";

interface Player {
  id: string;
  username: string;
  cards: any[];
}

const PlayerSlot: React.FC<{ player: Player }> = ({ player }) => {
  return (
    <div className="player-slot">
      <div className="player-info">
        <span>{player.username}</span>
      </div>
      <div className="card-slot">
        {player.cards.length > 0 ? (
          <img src={player.cards[0].imageUrl} alt={player.cards[0].name} />
        ) : (
          <div className="empty-slot">Пустой слот</div>
        )}
      </div>
    </div>
  );
};

export default PlayerSlot;