import React from "react";
import { Card } from "../domain/Card";

interface CardSlotProps {
  card: Card | null;
}

const CardSlot: React.FC<CardSlotProps> = ({ card }) => {
  return (
    <div className="card-slot">
      {card ? (
        <img src={card.imageUrl} alt={card.name} className="card-image" />
      ) : (
        <div className="empty-slot">Пустой слот</div>
      )}
    </div>
  );
};

export default CardSlot;