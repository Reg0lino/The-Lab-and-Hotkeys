/**
 * THE LAB // placement.js
 * Collision-Avoiding Grid Placement Engine
 */

const PlacementEngine = {
    paddingX: 8,       // Tight horizontal padding
    paddingY: 8,       // Tight vertical padding
    rowHeight: 32,     // Visual height step matching compact style
    defaultStartX: 15, // Left boundary start coordinate
    defaultStartY: 125, // Adjusted start height to clear the new separate input bar

    /**
     * Calculates the nearest open coordinate position for a newly spawned card
     * @param {string} text - The word to be spawned
     * @param {HTMLElement} boardElement - The canvas board element
     * @returns {Object} { left, top } absolute pixel coordinates
     */
    findOpenPosition(text, boardElement) {
        if (!boardElement) return { left: this.defaultStartX, top: this.defaultStartY };

        // Measure the width of the word card offscreen
        const tempMeasurer = document.createElement('div');
        tempMeasurer.className = 'magnet-card';
        tempMeasurer.style.visibility = 'hidden';
        tempMeasurer.style.position = 'absolute';
        tempMeasurer.textContent = text;
        boardElement.appendChild(tempMeasurer);
        
        const cardWidth = tempMeasurer.offsetWidth || (text.length * 9 + 18);
        const cardHeight = tempMeasurer.offsetHeight || 28;
        boardElement.removeChild(tempMeasurer);

        const containerRect = boardElement.getBoundingClientRect();
        const maxLimitX = containerRect.width || 800;

        // Fetch all existing placed cards on the board
        const existingCards = Array.from(boardElement.querySelectorAll('.magnet-card')).map(card => {
            return {
                left: parseFloat(card.style.left) || 0,
                top: parseFloat(card.style.top) || 0,
                width: card.offsetWidth,
                height: card.offsetHeight
            };
        });

        let targetX = this.defaultStartX;
        let targetY = this.defaultStartY;
        let spaceIsFound = false;

        // Scan loop to resolve coordinates overlaps
        while (!spaceIsFound) {
            let collisionDetected = false;

            for (let i = 0; i < existingCards.length; i++) {
                const checkCard = existingCards[i];

                const overlapX = (targetX < checkCard.left + checkCard.width + this.paddingX) &&
                                 (targetX + cardWidth + this.paddingX > checkCard.left);
                const overlapY = (targetY < checkCard.top + checkCard.height + this.paddingY) &&
                                 (targetY + cardHeight + this.paddingY > checkCard.top);

                if (overlapX && overlapY) {
                    collisionDetected = true;
                    // Shift coordinate to the right of the colliding card
                    targetX = checkCard.left + checkCard.width + this.paddingX;
                    break;
                }
            }

            // If the shifted coordinate hits the horizontal limit, wrap to the next row
            if (targetX + cardWidth > maxLimitX) {
                targetX = this.defaultStartX;
                targetY += (this.rowHeight + this.paddingY);
                collisionDetected = true; // Verify again on the new row
            }

            if (!collisionDetected) {
                spaceIsFound = true;
            }
        }

        return { left: targetX, top: targetY };
    }
};