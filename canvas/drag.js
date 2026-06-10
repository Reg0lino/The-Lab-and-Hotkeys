/**
 * THE LAB // drag.js
 * Unified Pointer-Event Drag-and-Drop Controller (with Drop-to-Save & Auto-Delete)
 */

const DragEngine = {
    activeCard: null,
    offsetX: 0,
    offsetY: 0,
    canvasBoard: null,

    /**
     * Initializes pointer listeners on the parent board container
     * @param {HTMLElement} boardElement - The container where words are dragged
     */
    init(boardElement) {
        if (!boardElement) return;
        this.canvasBoard = boardElement;

        this.canvasBoard.addEventListener('pointerdown', (e) => this.handlePointerDown(e));
        this.canvasBoard.addEventListener('pointermove', (e) => this.handlePointerMove(e));
        this.canvasBoard.addEventListener('pointerup', (e) => this.handlePointerUp(e));
        this.canvasBoard.addEventListener('pointercancel', (e) => this.handlePointerUp(e));
    },

    /**
     * Handles the initial pointer click/touch grab
     */
    handlePointerDown(e) {
        const card = e.target.closest('.magnet-card');
        if (!card) return;

        this.activeCard = card;
        this.activeCard.setPointerCapture(e.pointerId);

        const rect = this.activeCard.getBoundingClientRect();
        this.offsetX = e.clientX - rect.left;
        this.offsetY = e.clientY - rect.top;
    },

    /**
     * Handles card movement and screen containment
     */
    handlePointerMove(e) {
        if (!this.activeCard) return;

        const containerRect = this.canvasBoard.getBoundingClientRect();
        
        let targetX = e.clientX - containerRect.left - this.offsetX;
        let targetY = e.clientY - containerRect.top - this.offsetY;

        this.activeCard.style.left = targetX + 'px';
        this.activeCard.style.top = targetY + 'px';
    },

    /**
     * Releases pointer tracking, runs drop checks, and triggers auto-saves
     */
    handlePointerUp(e) {
        if (!this.activeCard) return;

        const boardRect = this.canvasBoard.getBoundingClientRect();
        const cardRect = this.activeCard.getBoundingClientRect();
        
        // 1. Check if dropped directly inside the Saved Dictionary Panel bounds
        const dictEl = document.getElementById('saved-dictionary');
        let droppedInDict = false;
        
        if (dictEl) {
            const dictRect = dictEl.getBoundingClientRect();
            if (e.clientX >= dictRect.left && e.clientX <= dictRect.right &&
                e.clientY >= dictRect.top && e.clientY <= dictRect.bottom) {
                droppedInDict = true;
            }
        }

        if (droppedInDict) {
            // Save word to custom dictionary bank, then remove card from canvas [1]
            const word = this.activeCard.textContent.trim();
            if (typeof StorageEngine !== 'undefined') {
                StorageEngine.addWordToCustomDictionary(word);
            }
            this.activeCard.remove();
        } else {
            // 2. Boundary Checking: If dragged outside the visual canvas bounds, auto-delete it
            const padding = 10;
            const outOfLeft = (cardRect.right < boardRect.left + padding);
            const outOfRight = (cardRect.left > boardRect.right - padding);
            const outOfTop = (cardRect.bottom < boardRect.top + 110); // Header + input clearance
            const outOfBottom = (cardRect.top > boardRect.bottom - padding);

            if (outOfLeft || outOfRight || outOfTop || outOfBottom) {
                this.activeCard.remove();
            }
        }

        this.activeCard.releasePointerCapture(e.pointerId);
        this.activeCard = null;

        // Call the storage controller auto-save function if registered
        if (typeof StorageEngine !== 'undefined' && typeof StorageEngine.saveActiveDraft === 'function') {
            StorageEngine.saveActiveDraft();
        }
    }
};