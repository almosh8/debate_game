// src/components/Judge.tsx
import React from "react";
import { PLAYER_COLORS } from "../utils/constants";

interface JudgeProps {
  judge: {
    id: string;
    username: string;
    seatNumber: number;
  };
  currentTurn: {
    seatNumber: number;
    stage: string;
  } | null;
}

const Judge: React.FC<JudgeProps> = ({ judge, currentTurn }) => {
  const isActive = currentTurn?.stage === "judge_speech" || currentTurn?.stage === "final_decision";
  const backgroundColor = isActive ? PLAYER_COLORS[judge.seatNumber % PLAYER_COLORS.length] : "transparent";
  const textColor = isActive ? 
    (judge.seatNumber % PLAYER_COLORS.length < 3 ? "white" : "black") : 
    "inherit";

  return (
    <div className="judge" style={{ backgroundColor }}>
      <div className="judge-info" style={{ color: textColor }}>
        <span>Судья: {judge.username}</span>
      </div>
    </div>
  );
};

export default Judge;