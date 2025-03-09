import React from "react";
import Team from "./Team";
import Judge from "./Judge";
import Game from "../domain/Game";
import CardSlot from "./CardSlot"; // Новый компонент для отображения карт на путях

interface GameTableProps {
  game: Game;
}

const GameTable: React.FC<GameTableProps> = ({ game }) => {
  const judge = game.players.find((p) => p.id === game.currentJudgeId);

  if (!judge) return <div>Судья не найден</div>;

  return (
    <div className="game-table">
    {/* Команда 1 (верхняя часть экрана) */}
    <Team players={game.team1} path={game.path1} position="top" />

    {/* Команда 2 (нижняя часть экрана) */}
    <Team players={game.team2} path={game.path2} position="bottom" />

    {/* Судья (справа) */}
    <Judge judge={judge} />
  </div>
  );
};

export default GameTable;