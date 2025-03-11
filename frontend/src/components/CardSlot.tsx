import React, { useState } from "react";
import { Card } from "../domain/Card";
import { Logger } from "../utils/Logger";

interface CardSlotProps {
  card: Card | null;
}

const CardSlot: React.FC<CardSlotProps> = ({ card }) => {
  const [isFullSize, setIsFullSize] = useState(false); // State to track full-size mode
  const logger = Logger.getInstance();

  const handleImageClick = () => {
    console.log("Image clicked!"); // Debugging
    setIsFullSize(!isFullSize); // Toggle full-size mode
    logger.info(`fullsize changed to ${isFullSize}`);
  };

  return (
    <div className="card-slot">
      {card ? (
        <>
          <img
            src={card.imageUrl}
            alt={card.name}
            className={`card-image ${isFullSize ? "full-size" : ""}`}
            onClick={handleImageClick} // Attach click handler here
          />
          {isFullSize && (
            <div className="overlay" onClick={handleImageClick}>
              <img
                src={card.imageUrl}
                alt={card.name}
                className="card-image full-size"
                onClick={handleImageClick}
              />
            </div>
          )}
        </>
      ) : (
        <div className="empty-slot">Пустой слот</div>
      )}
    </div>
  );
};

export default CardSlot;