import React from "react";

interface Player {
  id: string;
  username: string;
}

const Judge: React.FC<{ judge: Player }> = ({ judge }) => {
  return (
    <div className="judge">
      <div className="judge-info">
        <span>Судья: {judge.username}</span>
      </div>
    </div>
  );
};

export default Judge;