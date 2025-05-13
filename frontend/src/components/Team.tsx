// src/components/Team.tsx
import React from "react";
import PlayerSlot from "./PlayerSlot";
import { Player } from "../domain/Player";
import { Card } from "../domain/Card";
import "../styles/styles.css";
import { PLAYER_COLORS } from "../utils/constants";

interface TeamProps {
  players: Player[];
  path: (Card | null)[];
  otherPath: (Card | null)[];
  position: "top" | "bottom";
  currentTurn: {
    seatNumber: number;
    stage: string;
  } | null;
}

const Team: React.FC<TeamProps> = ({ players, path, otherPath, position, currentTurn }) => {
  const isTeamActive = currentTurn?.stage === "team_discussion" && 
    ((position === "top" && currentTurn.seatNumber <= 3) || 
     (position === "bottom" && currentTurn.seatNumber > 3));

  const findTargetCard = (playedOn: string | null): Card | null => {
    if (!playedOn) return null;
    
    const [type, pathNum] = playedOn.match(/(good|bad)(\d)/)?.slice(1) || [];
    const targetPathNum = parseInt(pathNum);
    
    const isSamePath = (position === "top" && targetPathNum === 1) || 
                      (position === "bottom" && targetPathNum === 2);
    
    if (!isSamePath) {
      if (type === "good") return otherPath[0] || null;
      if (type === "bad") return otherPath.length > 1 ? otherPath[1] : null;
    }

    if (type === "good") return path[0] || null;
    if (type === "bad") return path.length > 1 ? path[1] : null;
    
    return null;
  };

  return (
    <div className={`team ${position}`}>
      {players.map((player, index) => {
        const card = path[index];
        const isLastCard = index === path.length - 1;
        const playedOn = isLastCard && card ? card.getPlayedOn() : null;
        const targetCard = playedOn ? findTargetCard(playedOn) : null;

        const isPlayerActive = currentTurn?.seatNumber === player.seatNumber && 
                             (currentTurn.stage === "card_selection" || 
                              currentTurn.stage === "initial_argumentation");


        return (
          <PlayerSlot
            key={player.id}
            player={player}
            card={card}
            showArrow={isLastCard && !!targetCard}
            targetCard={targetCard}
            position={position}
            isActive={isPlayerActive || isTeamActive}
          />
        );
      })}
    </div>
  );
};

export default Team;