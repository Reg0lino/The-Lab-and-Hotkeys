/**
 * THE LAB // drag.js
 * Unified Pointer-Event Drag-and-Drop Controller (Symmetric Multi-Drag, Drop-to-Save & Auto-Delete)
 */

const DragEngine = {
    activeCard: null,
    offsetX: 0,
    offsetY: 0,
    canvasBoard: null,
    draggedCards: [],
    startX: 0,
    startY: 0,

    /**
     * Initializes pointer listeners on the parent board container
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
     * Handles card selections and dragging initializations
     */
    handlePointerDown(e) {
        // Exit immediately if clicking the hover-save bubble
        if (e.target.classList.contains('card-save-plus')) {
            return;
        }

        const card = e.target.closest('.magnet-card');
        if (!card) return;

        // Interactive: Ctrl-Click / Cmd-Click selection toggling
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            e.stopPropagation();
            
            card.classList.toggle('selected');
            
            // Update the state of the "Clear Board" to "Clear Selection"
            if (typeof window.updateClearButtonState === 'function') {
                window.updateClearButtonState();
            }
            if (typeof StorageEngine !== 'undefined') {
                StorageEngine.saveActiveDraft();
            }
            return; // Exit to prevent dragging during selection
        }

        this.activeCard = card;
        this.activeCard.setPointerCapture(e.pointerId);

        // Track the group of cards currently selected
        if (this.activeCard.classList.contains('selected')) {
            this.draggedCards = Array.from(this.canvasBoard.querySelectorAll('.magnet-card.selected'));
        } else {
            this.draggedCards = [this.activeCard];
        }

        // Cache initial starting coordinates for the entire selected set
        this.draggedCards.forEach(c => {
            c.dataset.startX = parseFloat(c.style.left) || 0;
            c.dataset.startY = parseFloat(c.style.top) || 0;
        });

        // Store active grab points
        this.startX = e.clientX;
        this.startY = e.clientY;
    },

    /**
     * Handles symmetric, offset-retaining multi-dragging calculations
     */
    handlePointerMove(e) {
        if (!this.activeCard) return;

        const containerRect = this.canvasBoard.getBoundingClientRect();
        
        // Calculate dragging movement distance (delta)
        const deltaX = e.clientX - this.startX;
        const deltaY = e.clientY - this.startY;

        // Slide all selected cards by identical delta values to retain spatial offsets
        this.draggedCards.forEach(c => {
            let targetX = (parseFloat(c.dataset.startX) || 0) + deltaX;
            let targetY = (parseFloat(c.dataset.startY) || 0) + deltaY;

            // Apply standard boundary constraints
            const minX = 0;
            const minY = 110; // Clearance for header + input rows
            const maxX = containerRect.width - c.offsetWidth;
            const maxY = containerRect.height - c.offsetHeight;

            if (targetX < minX) targetX = minX;
            if (targetX > maxX) targetX = maxX;
            if (targetY < minY) targetY = minY;
            if (targetY > maxY) targetY = maxY;

            c.style.left = targetX + 'px';
            c.style.top = targetY + 'px';
        });
    },

    /**
     * Runs multi-card drop saves and auto-deletes
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
            // Copy-on-Drop: Saves all currently dragged cards to vocabulary
            this.draggedCards.forEach(c => {
                const word = c.dataset.word || c.textContent.trim();
                if (typeof StorageEngine !== 'undefined') {
                    StorageEngine.addWordToCustomDictionary(word);
                }
            });
        } else {
            // 2. Boundary Checking: If active dragged card goes off-board, delete the entire set
            const padding = 10;
            const outOfLeft = (cardRect.right < boardRect.left + padding);
            const outOfRight = (cardRect.left > boardRect.right - padding);
            const outOfTop = (cardRect.bottom < boardRect.top + 110);
            const outOfBottom = (cardRect.top > boardRect.bottom - padding);

            if (outOfLeft || outOfRight || outOfTop || outOfBottom) {
                this.draggedCards.forEach(c => c.remove());
                if (typeof window.updateClearButtonState === 'function') {
                    window.updateClearButtonState();
                }
            }
        }

        this.activeCard.releasePointerCapture(e.pointerId);
        this.activeCard = null;
        this.draggedCards = [];

        if (typeof StorageEngine !== 'undefined') {
            StorageEngine.saveActiveDraft();
        }
    }
};