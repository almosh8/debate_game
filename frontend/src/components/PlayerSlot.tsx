import React, { useState } from "react";
import { Player } from "../domain/Player";
import { Card } from "../domain/Card";
import { Logger } from "../utils/Logger";
import ReactDOM from "react-dom";

interface PlayerSlotProps {
  player: Player;
  card: Card | null;
}

const PlayerSlot: React.FC<PlayerSlotProps> = ({ player, card }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const logger = Logger.getInstance()

  const handleImageClick = () => {
    setIsFullScreen(!isFullScreen);
    logger.info(`fullscreen changed to ${isFullScreen}`);
  };

  return (
    <div className="player-slot">
      <div className="player-info">
        <span>{player.username}</span>
      </div>
      <div className="card-slot">
        {card ? (
          <>
            <img
              src={card.imageUrl}
              alt={card.name}
              className="card-image"
              onClick={handleImageClick}
              style={{ cursor: "pointer" }}
            />
            {isFullScreen &&
              ReactDOM.createPortal(
                <div
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 1000,
                  }}
                  onClick={handleImageClick}
                >
                  <img
                    src={card.imageUrl}
                    alt={card.name}
                    style={{
                      maxWidth: "90%",
                      maxHeight: "90%",
                      objectFit: "contain",
                    }}
                  />
                </div>,
                document.body
              )}
          </>
        ) : (
          <div className="empty-slot">Пустой слот</div>
        )}
      </div>
    </div>
  );
};

export default PlayerSlot;