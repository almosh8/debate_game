import React from "react";
import Team from "./Team";
import Judge from "./Judge";

interface Player {
  id: string;
  username: string;
  cards: any[]; // Карты игрока
}

interface Game {
  team1: Player[];
  team2: Player[];
  judge: Player;
}

const GameTable: React.FC<{ game: Game }> = ({ game }) => {
  return (

    <div className="game-table">
      {/* Команда 1 (верхняя часть экрана) */}
      <Team players={game.team1} position="top" />

      {/* Судья (справа) */}
      <Judge judge={game.judge} />

      {/* Команда 2 (нижняя часть экрана) */}
      <Team players={game.team2} position="bottom" />
    </div>
  );
};

export default GameTable;