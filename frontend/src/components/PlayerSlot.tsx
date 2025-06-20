import React, { useState, useRef, useEffect } from "react";
import { Player } from "../domain/Player";
import { Card } from "../domain/Card";
import { Logger } from "../utils/Logger";
import ReactDOM from "react-dom";
import "../styles/styles.css";
import { getContrastColor } from '../utils/colorUtils';

interface PlayerSlotProps {
  player: Player;
  card: Card | null;
  showArrow?: boolean;
  targetCard?: Card | null;
  position: "top" | "bottom";
  isActive?: boolean;
}

const PlayerSlot: React.FC<PlayerSlotProps> = ({
  player, 
  card, 
  showArrow, 
  targetCard, 
  position,
  isActive = false
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [arrowStyles, setArrowStyles] = useState<{
    vertical1?: React.CSSProperties;
    horizontal?: React.CSSProperties;
    vertical2?: React.CSSProperties;
    arrowHead?: React.CSSProperties;
    circle2?: React.CSSProperties;
  }>({});
  const cardRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const logger = Logger.getInstance();

  // Получаем цвет для текущего игрока
const playerColor = player.color;
  const backgroundColor = isActive ? player.color : "transparent";
  const textColor = isActive ? getContrastColor(player.color) : player.color;
  const handleImageClick = () => {
    setIsFullScreen(!isFullScreen);
    logger.info(`Fullscreen toggled: ${isFullScreen}`);
  };

  useEffect(() => {
    if (!showArrow || !targetCard || !cardRef.current || !card) return;

    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 10;
    const retryInterval = 100;

    const updateArrowPosition = () => {
      const cardRect = cardRef.current?.getBoundingClientRect();
      const targetCardElement = document.querySelector(`[data-card-id="${targetCard.id}"]`);
      const targetRect = targetCardElement?.getBoundingClientRect();
      
      // Retry logic if target not found
      if (!targetRect && retryCount < maxRetries) {
        retryCount++;
        setTimeout(updateArrowPosition, retryInterval);
        return;
      }

      if (!cardRect || !targetRect) {
        logger.debug("Arrow positioning skipped - missing rects");
        return;
      }

      if (!isMounted) return;

      const centerY = window.innerHeight / 2;
      const cardCenterX = cardRect.left + cardRect.width / 2;
      const targetCenterX = targetRect.left + targetRect.width / 2;
      const cardBorderOffset = cardRect.width / 4; // Сдвиг на 1/4 ширины карты

      // Common styles for all cases
      const commonStyles = {
        vertical1: {
          width: "5px",
          backgroundColor: playerColor,
          position: "absolute" as const
        },
        horizontal: {
          height: "5px",
          backgroundColor: playerColor,
          position: "absolute" as const
        },
        vertical2: {
          width: "5px",
          backgroundColor: playerColor,
          position: "absolute" as const
        },
        arrowHead: {
          position: "absolute" as const,
          width: "0",
          height: "0",
          borderLeft: "22px solid transparent",
          borderRight: "22px solid transparent"
        },
        circle2: {
          position: "absolute" as const,
          width: "9px",
          height: "9px",
          borderRadius: "50%",
          backgroundColor: playerColor,
          transform: "translateY(-50%)"
        }
      };

      if (position === "top") {
        const isTargetAtBottom = targetRect.top > centerY;
        // Определяем направление сдвига
        const offsetDirection = isTargetAtBottom ? -1 : 1;
        const horizontalOffset = offsetDirection * cardBorderOffset;

        // Vertical1 - from card bottom to centerY
        const vertical1Height = centerY - cardRect.bottom - 22;
        const vertical1Left = cardCenterX - cardRect.left;
        const vertical1Top = cardRect.height;

        // Horizontal - from cardCenterX to targetCenterX at centerY
        const horizontalWidth = Math.abs(targetCenterX - cardCenterX) - horizontalOffset;
        const horizontalLeft = Math.min(targetCenterX, cardCenterX) - cardRect.left  + horizontalOffset;
        const horizontalTop = centerY - cardRect.top - 22;

        // Vertical2 - from centerY to target
        const vertical2Height = isTargetAtBottom 
          ? targetRect.top - centerY + 22 - 10
          : centerY - targetRect.bottom - 22 - 10;
        const vertical2Left = targetCenterX - cardRect.left + horizontalOffset;
        const vertical2Top = isTargetAtBottom 
          ? centerY - cardRect.top - 22
          : cardRect.height + 22 - 10;

        // Arrow head
        const arrowHeadBorder = isTargetAtBottom
          ? { borderTop: `50px solid ${playerColor}`, borderBottom: "0px solid transparent" }
          : { borderTop: "0px solid transparent", borderBottom: `50px solid ${playerColor}` };
        const arrowHeadTop = isTargetAtBottom
          ? targetRect.top - cardRect.top - 50
          : targetRect.bottom - cardRect.top;
        const arrowHeadLeft = targetCenterX - cardRect.left - 20 + horizontalOffset;

        setArrowStyles({
          vertical1: {
            ...commonStyles.vertical1,
            height: `${vertical1Height}px`,
            left: `${vertical1Left}px`,
            top: `${vertical1Top}px`
          },
          horizontal: {
            ...commonStyles.horizontal,
            width: `${horizontalWidth}px`,
            left: `${horizontalLeft}px`,
            top: `${horizontalTop}px`
          },
          vertical2: {
            ...commonStyles.vertical2,
            height: `${vertical2Height}px`,
            left: `${vertical2Left}px`,
            top: `${vertical2Top}px`
          },
          arrowHead: {
            ...commonStyles.arrowHead,
            ...arrowHeadBorder,
            left: `${arrowHeadLeft}px`,
            top: `${arrowHeadTop}px`
          },
          circle2: {
            ...commonStyles.circle2,
            left: `${cardCenterX - cardRect.left - 5}px`,
            top: `${horizontalTop}px`
          }
        });
      } else if (position === "bottom") {
        const isTargetAtTop = targetRect.bottom < centerY;
        // Определяем направление сдвига
        const offsetDirection = isTargetAtTop ? -1 : 1;
        const horizontalOffset = offsetDirection * cardBorderOffset;

        // Vertical1 - from card top to centerY
        const vertical1Height = cardRect.top - centerY;
        const vertical1Left = cardCenterX - cardRect.left;
        const vertical1Top = centerY - cardRect.top;

        // Horizontal - from cardCenterX to targetCenterX at centerY
        const horizontalWidth = Math.abs(targetCenterX - cardCenterX) - horizontalOffset;
        const horizontalLeft = Math.min(targetCenterX, cardCenterX) - cardRect.left + horizontalOffset;
        const horizontalTop = centerY - cardRect.top;

        // Vertical2 - from centerY to target
        const vertical2Height = isTargetAtTop 
          ? centerY - targetRect.bottom - 10
          : targetRect.top - centerY - 10;
        const vertical2Left = targetCenterX - cardRect.left + horizontalOffset;
        const vertical2Top = isTargetAtTop
          ? targetRect.bottom - cardRect.top + 10
          : centerY - cardRect.top;

        // Arrow head
        const arrowHeadBorder = isTargetAtTop
          ? { borderTop: "0px solid transparent", borderBottom: `50px solid ${playerColor}` }
          : { borderTop: `50px solid ${playerColor}`, borderBottom: "0px solid transparent" };
        const arrowHeadTop = isTargetAtTop
          ? targetRect.bottom - cardRect.top
          : targetRect.top - cardRect.top - 50;
        const arrowHeadLeft = targetCenterX - cardRect.left - 20 + horizontalOffset;

        setArrowStyles({
          vertical1: {
            ...commonStyles.vertical1,
            height: `${vertical1Height}px`,
            left: `${vertical1Left}px`,
            top: `${vertical1Top}px`
          },
          horizontal: {
            ...commonStyles.horizontal,
            width: `${horizontalWidth}px`,
            left: `${horizontalLeft}px`,
            top: `${horizontalTop}px`
          },
          vertical2: {
            ...commonStyles.vertical2,
            height: `${vertical2Height}px`,
            left: `${vertical2Left}px`,
            top: `${vertical2Top}px`
          },
          arrowHead: {
            ...commonStyles.arrowHead,
            ...arrowHeadBorder,
            left: `${arrowHeadLeft}px`,
            top: `${arrowHeadTop}px`
          },
          circle2: {
            ...commonStyles.circle2,
            left: `${cardCenterX - cardRect.left - 5}px`,
            top: `${horizontalTop}px`
          }
        });
      }
    };

    updateArrowPosition();
    window.addEventListener("resize", updateArrowPosition);
    
    return () => {
      isMounted = false;
      window.removeEventListener("resize", updateArrowPosition);
    };
  }, [showArrow, targetCard, position, card, logger, playerColor]);

  if(position === "top")
  return (
    <div className="player-slot" data-card-id={card?.id} ref={slotRef} style = {{background: backgroundColor}}>
      <div className="player-info" style={{ color: textColor }}>
        <span>{player.username}</span>
      </div>
      <div className="card-slot" ref={cardRef}>
        {card ? (
          <>
            <img
              src={card.imageUrl}
              alt={card.name}
              className="card-image"
              onClick={handleImageClick}
              style={{ cursor: "pointer", border: `2px solid ${playerColor}` }}
              data-card-id={card.id}
            />
            
            {showArrow && targetCard && (
              <div className="arrow-container" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 10 }}>
                {arrowStyles.vertical1 && <div style={arrowStyles.vertical1} />}
                {arrowStyles.horizontal && <div style={arrowStyles.horizontal} />}
                {arrowStyles.vertical2 && <div style={arrowStyles.vertical2} />}
                {arrowStyles.arrowHead && <div style={arrowStyles.arrowHead} />}
                {arrowStyles.circle2 && <div style={arrowStyles.circle2} />}
              </div>
            )}
            
            {isFullScreen &&
              ReactDOM.createPortal(
                <div className="fullscreen-overlay" onClick={handleImageClick}>
                  <img
                    src={card.imageUrl}
                    alt={card.name}
                    className="fullscreen-image"
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

  if(position === "bottom")
  return (
    <div className="player-slot" data-card-id={card?.id} ref={slotRef} style = {{background: backgroundColor}}>
      
      <div className="card-slot" ref={cardRef}>
        {card ? (
          <>
            <img
              src={card.imageUrl}
              alt={card.name}
              className="card-image"
              onClick={handleImageClick}
              style={{ cursor: "pointer", border: `2px solid ${playerColor}` }}
              data-card-id={card.id}
            />
            
            {showArrow && targetCard && (
              <div className="arrow-container" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 10 }}>
                {arrowStyles.vertical1 && <div style={arrowStyles.vertical1} />}
                {arrowStyles.horizontal && <div style={arrowStyles.horizontal} />}
                {arrowStyles.vertical2 && <div style={arrowStyles.vertical2} />}
                {arrowStyles.arrowHead && <div style={arrowStyles.arrowHead} />}
                {arrowStyles.circle2 && <div style={arrowStyles.circle2} />}
              </div>
            )}
            
            {isFullScreen &&
              ReactDOM.createPortal(
                <div className="fullscreen-overlay" onClick={handleImageClick}>
                  <img
                    src={card.imageUrl}
                    alt={card.name}
                    className="fullscreen-image"
                  />
                </div>,
                document.body
              )}
          </>
        ) : (
          <div className="empty-slot">Пустой слот</div>
        )}
      </div>

      <div className="player-info" style={{ color: textColor }}>
        <span>{player.username}</span>
      </div>
    </div>
  );

  return (        <span>ERROR</span>
);
};

export default PlayerSlot;