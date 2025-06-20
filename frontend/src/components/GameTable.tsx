import React, { useState, useEffect } from 'react';
import Team from './Team';
import Judge from './Judge';
import { Game } from '../domain/Game';
import '../styles/styles.css';

interface GameTableProps {
  game: Game;
}

const GameTable: React.FC<GameTableProps> = ({ game }) => {
  const [timeLeft, setTimeLeft] = useState(game.timer);
  const [isTimeUp, setIsTimeUp] = useState(false);

const getCurrentPlayerInfo = () => {
  if (!game.currentTurn) return '';
  
  const player = game.players.find(p => p.seatNumber === game.currentTurn?.seatNumber);
  const shouldShowPlayer = ['card_selection', 'initial_argumentation'].includes(game.currentTurn.stage);
  
  return shouldShowPlayer ? `\n(${player?.username || 'Неизвестный'})` : '';
};

  useEffect(() => {
    setTimeLeft(game.timer);
    setIsTimeUp(false);
  }, [game.timer]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsTimeUp(true);
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerId);
          setIsTimeUp(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getStageName = (stage: string) => {
    switch(stage) {
      case "card_selection": return "Выбор\nкарты";
      case "initial_argumentation": return "Первичная\nаргументация";
      case "team_discussion": return "Командное\nобсуждение";
      case "judge_speech": return "Речь\nсудьи";
      case "final_decision": return "Принятие\nрешения";
      default: return stage;
    }
  };

  return (
    <div className="game-table">
      {game.currentTurn && (
        <div className={`game-timer ${isTimeUp ? 'time-up' : ''}`}>
          <div className="timer-value">{formatTime(timeLeft)}</div>
          <div className="timer-stage">
            {getStageName(game.currentTurn.stage)}
            {(game.currentTurn.stage === "card_selection" || game.currentTurn.stage === "initial_argumentation") && `${getCurrentPlayerInfo()}`}
          </div>
        </div>
      )}

      <Team 
        players={game.team1} 
        path={game.path1}
        otherPath={game.path2}
        position="top"
        currentTurn={game.currentTurn}
      />

      <Judge 
        judge={game.judge} 
        currentTurn={game.currentTurn}
      />

      <Team 
        players={game.team2} 
        path={game.path2} 
        otherPath={game.path1}
        position="bottom"
        currentTurn={game.currentTurn}
      />
    </div>
  );
};

export default GameTable;