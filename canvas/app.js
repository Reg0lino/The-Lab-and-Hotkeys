/**
 * THE LAB // app.js
 * Central Orchestration, DOM Event Bindings, and Exporter Controller (With Middle-Click Delete & Single Select)
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. DOM Element Cache
    const board = document.getElementById('canvas-board');
    const themeSelect = document.getElementById('theme-select');
    const draftSelect = document.getElementById('draft-select');
    const openWorksheetBtn = document.getElementById('open-worksheet-btn');
    const newDraftInput = document.getElementById('new-draft-input');
    const createDraftBtn = document.getElementById('create-draft-btn');
    const deleteDraftBtn = document.getElementById('delete-draft-btn');
    const customWordInput = document.getElementById('custom-word-input');
    const apiModeSelect = document.getElementById('api-mode-select');
    const addWordBtn = document.getElementById('add-word-btn');
    const copyTextBtn = document.getElementById('copy-text-btn');
    const clearBoardBtn = document.getElementById('clear-board-btn');
    const exportPngBtn = document.getElementById('export-png-btn');
    const exportDictTxtBtn = document.getElementById('export-dictionary-txt-btn');
    const clearDictBtn = document.getElementById('clear-dictionary-btn');
    const saveBoardBtn = document.getElementById('save-board-btn');
    const saveAsBtn = document.getElementById('save-as-btn');
    
    // Undo / Redo / Select elements
    const undoBtn = document.getElementById('undo-btn');
    const redoBtn = document.getElementById('redo-btn');
    const selectAllBtn = document.getElementById('select-all-btn');
    const deselectAllBtn = document.getElementById('deselect-all-btn');
    
    // Dedicated Multi-Delete Buttons
    const deleteSelectedBoardBtn = document.getElementById('delete-selected-board-btn');
    const deleteSelectedDictBtn = document.getElementById('delete-selected-dict-btn');
    
    // API Suggestions Elements
    const suggestionsDrawer = document.getElementById('suggestions-drawer');
    const suggestionsList = document.getElementById('suggestions-list');
    const saveAllSuggestionsBtn = document.getElementById('save-all-suggestions-btn');
    
    // Bulk spawner buttons
    const addTop5Btn = document.getElementById('add-top-5-btn');
    const addTop10Btn = document.getElementById('add-top-10-btn');
    const addTop20Btn = document.getElementById('add-top-20-btn');
    const randomWordBtn = document.getElementById('random-word-btn');
    
    // Chord & Progression Reference Elements
    const chordRootSelect = document.getElementById('chord-root-select');
    const chordTuningSelect = document.getElementById('chord-tuning-select');
    const chordTabsTableBody = document.getElementById('chord-tabs-table-body');
    const progressionDirSelect = document.getElementById('progression-dir-select');
    const progressionsTableBody = document.getElementById('progressions-table-body');

    let rhymeDebounceTimer = null;

    // Master memory array for the dynamic randomizer
    window.masterVocabularyPool = [];
    // HOVER TO USE NUMMINUS for DELETE HOTKEY
    window.hoveredCard = null; // Add this line to track hover states
    window.hoveredDictBadge = null; // Track dictionary badges for deletion

// ==========================================================================
    // 2. IN-WINDOW PROMISE MODAL OVERLAYS (RESOLVES BROWSER POPUPS RISK)
    // ==========================================================================
    window.customAlert = function(title, message) {
        return new Promise((resolve) => {
            const overlay = document.getElementById('custom-modal');
            const titleEl = document.getElementById('modal-title');
            const bodyEl = document.getElementById('modal-body');
            const inputEl = document.getElementById('modal-input');
            const confirmBtn = document.getElementById('modal-btn-confirm');
            const cancelBtn = document.getElementById('modal-btn-cancel');

            titleEl.textContent = title.toUpperCase();
            bodyEl.textContent = message;
            inputEl.style.display = 'none'; // Ensure prompt text input is hidden
            cancelBtn.style.display = 'none'; // Hide cancel button for simple alerts
            overlay.style.display = 'flex';

            // Auto-focus the Confirm button for instant Enter confirmation
            confirmBtn.focus();

            const onConfirm = () => {
                overlay.style.display = 'none';
                confirmBtn.removeEventListener('click', onConfirm);
                resolve();
            };

            confirmBtn.addEventListener('click', onConfirm);
        });
    };

    window.customConfirm = function(title, message) {
        return new Promise((resolve) => {
            const overlay = document.getElementById('custom-modal');
            const titleEl = document.getElementById('modal-title');
            const bodyEl = document.getElementById('modal-body');
            const inputEl = document.getElementById('modal-input');
            const confirmBtn = document.getElementById('modal-btn-confirm');
            const cancelBtn = document.getElementById('modal-btn-cancel');

            titleEl.textContent = title.toUpperCase();
            bodyEl.textContent = message;
            inputEl.style.display = 'none'; // Ensure prompt text input is hidden
            cancelBtn.style.display = 'inline-block'; // Show cancel button for confirmations
            overlay.style.display = 'flex';

            // Auto-focus the Confirm button for instant Enter confirmation
            confirmBtn.focus();

            const cleanup = (result) => {
                overlay.style.display = 'none';
                confirmBtn.removeEventListener('click', onConfirm);
                cancelBtn.removeEventListener('click', onCancel);
                resolve(result);
            };

            const onConfirm = () => cleanup(true);
            const onCancel = () => cleanup(false);

            confirmBtn.addEventListener('click', onConfirm);
            cancelBtn.addEventListener('click', onCancel);
        });
    };

    window.customPrompt = function(title, message, defaultValue = '') {
        return new Promise((resolve) => {
            const overlay = document.getElementById('custom-modal');
            const titleEl = document.getElementById('modal-title');
            const bodyEl = document.getElementById('modal-body');
            const inputEl = document.getElementById('modal-input');
            const confirmBtn = document.getElementById('modal-btn-confirm');
            const cancelBtn = document.getElementById('modal-btn-cancel');

            titleEl.textContent = title.toUpperCase();
            bodyEl.innerHTML = message; // Aligned: Allows html tags inside the custom prompt
            
            // Show prompt text input, pre-populate value, and select it
            inputEl.value = defaultValue;
            inputEl.style.display = 'block';
            cancelBtn.style.display = 'inline-block';
            overlay.style.display = 'flex';

            inputEl.focus();
            inputEl.select(); // Pre-selects text for immediate typing/overwriting

            const cleanup = (result) => {
                overlay.style.display = 'none';
                inputEl.style.display = 'none'; // Hide text input again
                confirmBtn.removeEventListener('click', onConfirm);
                cancelBtn.removeEventListener('click', onCancel);
                inputEl.removeEventListener('keydown', onInputKeyDown);
                resolve(result);
            };

            const onConfirm = () => cleanup(inputEl.value.trim());
            const onCancel = () => cleanup(null);

            const onInputKeyDown = (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    onConfirm();
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    onCancel();
                }
            };

            confirmBtn.addEventListener('click', onConfirm);
            cancelBtn.addEventListener('click', onCancel);
            inputEl.addEventListener('keydown', onInputKeyDown);
        });
    };

    // ==========================================================================
    // 3. DYNAMIC JSON THEME LOADER ENGINE
    // ==========================================================================
    const loadDynamicThemesList = () => {
        if (!themeSelect) return;

        fetch('data/themes.json')
            .then(response => {
                if (!response.ok) throw new Error();
                return response.json();
            })
            .then(themes => {
                themeSelect.innerHTML = '';
                
                // Read local active choice from memory cache
                const savedTheme = localStorage.getItem('the_lab_active_theme') || 'theme-g910';
                
                themes.forEach(t => {
                    const opt = document.createElement('option');
                    opt.value = t.value;
                    opt.textContent = t.label;
                    if (t.value === savedTheme) {
                        opt.selected = true;
                        document.body.className = savedTheme;
                    }
                    themeSelect.appendChild(opt);
                });

                // Listen for changes
                themeSelect.addEventListener('change', () => {
                    document.body.className = themeSelect.value;
                    localStorage.setItem('the_lab_active_theme', themeSelect.value);
                });
            })
            .catch(err => {
                console.warn("Themes configuration file missing offline. Loading hardcoded default. ", err);
                themeSelect.innerHTML = '<option value="theme-g910" selected>1. G910 HUD (DAW Default)</option>';
                document.body.className = 'theme-g910';
            });
    };

    // Load active themes first
    loadDynamicThemesList();

    // ==========================================================================
    // 4. GLOBAL SPAWNER EXPOSITION (WITH ADVANCED INPUT CONTROLS)
    // ==========================================================================
    window.spawnCardElement = function(text, isCustom, left, top) {
        if (!board) return null;
        
        const card = document.createElement('div');
        card.className = 'magnet-card' + (isCustom ? ' custom-word' : '');
        card.style.left = left + 'px';
        card.style.top = top + 'px';
        card.style.overflow = 'visible'; // Ensures hover elements sits outside boundary bounds
        
        // Core Fix: Store the clean, raw word inside a custom HTML data attribute
        card.dataset.word = text;
        
        // Wrap text inside a child span to isolate from hover elements
        const textSpan = document.createElement('span');
        textSpan.textContent = text;
        card.appendChild(textSpan);

        // Integrated: Glowing green hover-save '+' button
        const savePlus = document.createElement('span');
        savePlus.className = 'card-save-plus';
        savePlus.textContent = '＋';
        savePlus.title = "Copy word to persistent saved vocabulary bank";
        
        // Non-bubbling click handler prevents card dragging conflicts
        savePlus.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            if (typeof StorageEngine !== 'undefined') {
                StorageEngine.addWordToCustomDictionary(text.trim());
            }
        });

        card.appendChild(savePlus);

        // Double-click: Isolates and selects ONLY this card
        card.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            e.preventDefault();
            
            // Deselect all other active cards
            const allCards = board.querySelectorAll('.magnet-card');
            allCards.forEach(c => c.classList.remove('selected'));
            
            // Highlight only this card
            card.classList.add('selected');
            
            window.updateClearButtonState();
            if (typeof StorageEngine !== 'undefined') StorageEngine.saveActiveDraft();
        });

        // Hover tracking: Sets window.hoveredCard dynamically on mouseenter/mouseleave
        card.addEventListener('mouseenter', () => {
            window.hoveredCard = card;
        });

        card.addEventListener('mouseleave', () => {
            if (window.hoveredCard === card) {
                window.hoveredCard = null;
            }
        });

        board.appendChild(card);
        return card;
    };

    // ==========================================================================
    // 5. ENGINE INITIALIZATION
    // ==========================================================================
    if (typeof DragEngine !== 'undefined') DragEngine.init(board);
    if (typeof StorageEngine !== 'undefined') StorageEngine.init(draftSelect, board);
    if (typeof ReferenceEngine !== 'undefined') ReferenceEngine.init(progressionDirSelect, progressionsTableBody);
    if (typeof APIEngine !== 'undefined') APIEngine.init(customWordInput, apiModeSelect, suggestionsDrawer, suggestionsList, saveAllSuggestionsBtn);

    // ==========================================================================
    // 5.5 WORKSHEET UI BINDINGS
    // ==========================================================================
    if (openWorksheetBtn) {
        openWorksheetBtn.addEventListener('click', () => {
            const modal = document.getElementById('worksheet-modal');
            if (modal) modal.style.display = 'flex';
        });
    }

    // ==========================================================================
    // 6. CHORD TRANSPOSER ENGINE (Aligned to read flat JSON keys)
    // ==========================================================================
    const loadTranscribedChords = () => {
        if (!chordRootSelect || !chordTuningSelect || !chordTabsTableBody) return;

        const root = chordRootSelect.value;
        const group = chordTuningSelect.value;
        
        // Save active selections to local storage cache
        localStorage.setItem('the_lab_active_chord_root', root);
        localStorage.setItem('the_lab_active_chord_group', group);
        
        const fileMap = {
            'C': 'key_c', 'C#': 'key_c_sharp', 'D': 'key_d', 'D#': 'key_d_sharp',
            'E': 'key_e', 'F': 'key_f', 'F#': 'key_f_sharp', 'G': 'key_g',
            'G#': 'key_g_sharp', 'A': 'key_a', 'A#': 'key_a_sharp', 'B': 'key_b'
        };
        
        const fileName = fileMap[root] || 'key_a';
        const url = `data/chords/${fileName}.json`;

        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('Data file missing');
                return response.json();
            })
            .then(data => {
                chordTabsTableBody.innerHTML = '';
                data.chords.forEach(c => {
                    let standardTab = [];
                    let dropTab = [];
                    
                    if (group === 'group1') {
                        standardTab = c.dstandard;
                        dropTab = c.dropc;
                    } else {
                        standardTab = c.estandard;
                        dropTab = c.dropd;
                    }

                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td style="font-weight:700; color:var(--text-primary);">${c.name}</td>
                        <td class="highlight-pink" style="font-family:var(--font-mono); font-weight:bold;">${dropTab.join('-')}</td>
                        <td class="highlight-cyan" style="font-family:var(--font-mono);">${standardTab.join('-')}</td>
                    `;
                    chordTabsTableBody.appendChild(row);
                });
            })
            .catch(err => {
                console.warn("Could not fetch relative chord JSON: ", err);
                chordTabsTableBody.innerHTML = '<tr><td colspan="3" style="text-align:center; font-style:italic; color:var(--neon-orange);">Offline: Please make sure data/chords/ folder contains correct JSON files.</td></tr>';
            });
    };

    chordRootSelect.addEventListener('change', loadTranscribedChords);
            chordTuningSelect.addEventListener('change', loadTranscribedChords);
            
            // Retrieve and apply cached selections on startup
            const savedRoot = localStorage.getItem('the_lab_active_chord_root') || 'A';
            const savedGroup = localStorage.getItem('the_lab_active_chord_group') || 'group1';
            chordRootSelect.value = savedRoot;
            chordTuningSelect.value = savedGroup;
            
            // Initial load for chord tab panel
            loadTranscribedChords();

    // ==========================================================================
    // 7. DYNAMIC OFFLINE WORD POOL LOADER
    // ==========================================================================
    const loadWordPool = (poolId, containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        const url = `data/word_pools/${poolId}.json`;

        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error();
                return response.json();
            })
            .then(words => {
                // Dynamically concat loaded words directly to the master randomizer pool
                window.masterVocabularyPool = window.masterVocabularyPool.concat(words);

                container.innerHTML = '';
                words.forEach(word => {
                    const badge = document.createElement('div');
                    badge.className = 'word-badge';
                    badge.textContent = word;

                    badge.addEventListener('click', () => {
                        if (typeof window.spawnCardElement === 'function' && typeof PlacementEngine !== 'undefined') {
                            const coords = PlacementEngine.findOpenPosition(word, board);
                            window.spawnCardElement(word, false, coords.left, coords.top);
                            StorageEngine.saveActiveDraft();
                        }
                    });

                    container.appendChild(badge);
                });
            })
            .catch(() => {
                container.innerHTML = '<span style="font-size:12px; font-style:italic; color:var(--neon-orange);">Offline: Please make sure data/word_pools/ directory contains files.</span>';
            });
    };

    // Load static offline word files automatically on load
    loadWordPool('verbs', 'verbs-bank');
    loadWordPool('nouns', 'nouns-bank');
    loadWordPool('adjectives', 'adjectives-bank');
    loadWordPool('esoteric', 'esoteric-bank');
    loadWordPool('particles', 'particles-bank');

    // ==========================================================================
    // 8. MULTI-DRAFT UI BINDINGS (CUSTOM POPUPS TRANSITION)
    // ==========================================================================
    createDraftBtn.addEventListener('click', () => {
        const name = newDraftInput.value.trim();
        if (!name) return;
        StorageEngine.createDraft(name);
        newDraftInput.value = '';
    });

    newDraftInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const name = newDraftInput.value.trim();
            if (!name) return;
            StorageEngine.createDraft(name);
            newDraftInput.value = '';
        }
    });

    deleteDraftBtn.addEventListener('click', async () => {
        const activeId = StorageEngine.activeProjectId;
        const project = StorageEngine.projects.find(p => p.id === activeId);
        if (!project) return;
        
        const confirmed = await window.customConfirm("Confirm Delete", `Are you sure you want to permanently delete the draft: "${project.name}"?`);
        if (confirmed) {
            StorageEngine.deleteProject(activeId);
        }
    });

    draftSelect.addEventListener('change', () => {
        StorageEngine.switchProject(draftSelect.value);
    });

    // ==========================================================================
    // 9. CUSTOM & BULK WORD SPAWNER BINDINGS
    // ==========================================================================
    const triggerCustomWordSpawn = () => {
        const rawText = customWordInput.value.trim();
        if (!rawText) return;
        
        // 1. Isolate question marks by padding them with spaces
        let processed = rawText.replace(/\?/g, ' ? ');
        
        // 2. Strip out all other forbidden punctuation (preserving only letters, numbers, spaces, apostrophes, question marks, and hyphens)
        processed = processed.replace(/[^\w\s'?-]/g, '');
        
        // 3. Split the sanitized sentence into an array of separate words
        const words = processed.trim().split(/\s+/);
        
        // 4. Sequentially calculate coordinate positions and spawn cards
        words.forEach(word => {
            const coords = PlacementEngine.findOpenPosition(word, board);
            window.spawnCardElement(word, true, coords.left, coords.top);
        });
        
        customWordInput.value = '';
        APIEngine.hideSuggestions();
        StorageEngine.saveActiveDraft();
    };

    addWordBtn.addEventListener('click', triggerCustomWordSpawn);
    customWordInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') triggerCustomWordSpawn();
    });

    // Add Top 5 Suggestions
    if (addTop5Btn) {
        addTop5Btn.addEventListener('click', () => {
            if (typeof APIEngine === 'undefined' || APIEngine.currentSuggestions.length === 0) return;
            const top5 = APIEngine.currentSuggestions.slice(0, 5);
            top5.forEach(item => {
                if (typeof window.spawnCardElement === 'function' && typeof PlacementEngine !== 'undefined') {
                    const coords = PlacementEngine.findOpenPosition(item.word, board);
                    window.spawnCardElement(item.word, false, coords.left, coords.top);
                }
            });
            StorageEngine.saveActiveDraft();
        });
    }

    // Add Top 10 Suggestions
    if (addTop10Btn) {
        addTop10Btn.addEventListener('click', () => {
            if (typeof APIEngine === 'undefined' || APIEngine.currentSuggestions.length === 0) return;
            const top10 = APIEngine.currentSuggestions.slice(0, 10);
            top10.forEach(item => {
                if (typeof window.spawnCardElement === 'function' && typeof PlacementEngine !== 'undefined') {
                    const coords = PlacementEngine.findOpenPosition(item.word, board);
                    window.spawnCardElement(item.word, false, coords.left, coords.top);
                }
            });
            StorageEngine.saveActiveDraft();
        });
    }

    // Add Top 20 Suggestions
    if (addTop20Btn) {
        addTop20Btn.addEventListener('click', () => {
            if (typeof APIEngine === 'undefined' || APIEngine.currentSuggestions.length === 0) return;
            const top20 = APIEngine.currentSuggestions.slice(0, 20);
            top20.forEach(item => {
                if (typeof window.spawnCardElement === 'function' && typeof PlacementEngine !== 'undefined') {
                    const coords = PlacementEngine.findOpenPosition(item.word, board);
                    window.spawnCardElement(item.word, false, coords.left, coords.top);
                }
            });
            StorageEngine.saveActiveDraft();
        });
    }

    // Interactive 🎲 Random Word Spawner (Triggers live API fetch with active mode)
    if (randomWordBtn) {
        randomWordBtn.addEventListener('click', () => {
            const hasPool = window.masterVocabularyPool && window.masterVocabularyPool.length > 0;

            if (!hasPool) {
                window.customAlert("System Offline", "The local vocabulary pools have not loaded. Make sure canvas/data/word_pools/ directory is fully populated.");
                return;
            }

            // Pick a random word from the dynamically aggregated master vocabulary pool
            const randomWord = window.masterVocabularyPool[Math.floor(Math.random() * window.masterVocabularyPool.length)];

            // Inject the rolled word into the search input field
            customWordInput.value = randomWord;

            // Trigger the live API search query immediately using your active dropdown query mode
            if (typeof APIEngine !== 'undefined') {
                APIEngine.query(randomWord, apiModeSelect.value);
            }
        });
    }

    // ==========================================================================
    // 10. MULTI-SELECTION CONTROL BUTTONS
    // ==========================================================================
    window.updateClearButtonState = function() {
        const selectedBoardCount = board.querySelectorAll('.magnet-card.selected').length;
        const selectedDictCount = document.querySelectorAll('.custom-badge-container.selected-badge').length;
        
        // Selection board controls
        if (deselectAllBtn) deselectAllBtn.disabled = selectedBoardCount === 0;
        if (deleteSelectedBoardBtn) deleteSelectedBoardBtn.disabled = selectedBoardCount === 0;

        // Selection dictionary controls
        if (deleteSelectedDictBtn) deleteSelectedDictBtn.disabled = selectedDictCount === 0;
    };

    if (selectAllBtn) {
        selectAllBtn.addEventListener('click', () => {
            const cards = board.querySelectorAll('.magnet-card');
            if (cards.length === 0) return;
            
            cards.forEach(c => c.classList.add('selected'));
            window.updateClearButtonState();
            StorageEngine.saveActiveDraft();
        });
    }

    if (deselectAllBtn) {
        deselectAllBtn.addEventListener('click', () => {
            const selected = board.querySelectorAll('.magnet-card.selected');
            selected.forEach(c => c.classList.remove('selected'));
            window.updateClearButtonState();
            StorageEngine.saveActiveDraft();
        });
    }

    // Custom Dedicated Delete Selection on Board Click Handler (Resolved: Immediate deletion)
    if (deleteSelectedBoardBtn) {
        deleteSelectedBoardBtn.addEventListener('click', () => {
            const selectedCards = Array.from(board.querySelectorAll('.magnet-card.selected'));
            if (selectedCards.length === 0) return;

            // Resolved: Canvas board selection deletions are now instant with zero popups
            selectedCards.forEach(c => c.remove());
            window.updateClearButtonState();
            StorageEngine.saveActiveDraft();
        });
    }

    // Custom Dedicated Delete Selected from Dictionary Bank Click Handler (Resolved: Keeps modal warnings)
    if (deleteSelectedDictBtn) {
        deleteSelectedDictBtn.addEventListener('click', async () => {
            const selectedBadges = Array.from(document.querySelectorAll('.custom-badge-container.selected-badge'));
            if (selectedBadges.length === 0) return;

            const confirmed = await window.customConfirm("Delete Saved Words", `Permanently delete all ${selectedBadges.length} selected words from your custom saved dictionary?`);
            if (confirmed) {
                const wordsToRemove = selectedBadges.map(el => el.querySelector('.word-badge').textContent.trim().toLowerCase());
                
                // Filter out from active dictionary memory bank
                StorageEngine.customDictionary = StorageEngine.customDictionary.filter(w => !wordsToRemove.includes(w));
                
                // Save and repaint
                localStorage.setItem(StorageEngine.customDictionaryKey, JSON.stringify(StorageEngine.customDictionary));
                StorageEngine.renderCustomDictionaryBank();
                window.updateClearButtonState();
            }
        });
    }

    // ==========================================================================
    // 11. UNDO / REDO HISTORY CLICK ACTIONS
    // ==========================================================================
    if (undoBtn) {
        undoBtn.addEventListener('click', () => {
            if (typeof StorageEngine !== 'undefined') StorageEngine.executeUndo();
        });
    }

    if (redoBtn) {
        redoBtn.addEventListener('click', () => {
            if (typeof StorageEngine !== 'undefined') StorageEngine.executeRedo();
        });
    }

// ==========================================================================
    // 13. SYSTEM BACKUP BINDINGS (JSON EXPORT/IMPORT)
    // ==========================================================================
    const exportBackupBtn = document.getElementById('export-backup-btn');
    const importBackupBtn = document.getElementById('import-backup-btn');
    const importFileInput = document.getElementById('import-file-input');

    if (exportBackupBtn) {
        exportBackupBtn.addEventListener('click', () => {
            if (typeof StorageEngine !== 'undefined') StorageEngine.exportSystemBackup();
        });
    }

    if (importBackupBtn && importFileInput) {
        // Clicking "Import Backup" programmatically triggers your browser file dialog
        importBackupBtn.addEventListener('click', () => {
            importFileInput.click();
        });

        // Event listener triggers when a file is successfully selected
        importFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && typeof StorageEngine !== 'undefined') {
                StorageEngine.importSystemBackup(file);
            }
            importFileInput.value = ''; // Reset input to allow re-uploading same file
        });
    }



    // Hardware Keyboard listeners for Undo/Redo & Deletions
    document.addEventListener('keydown', async (e) => {
        // Ignore hotkeys if user is currently typing inside active fields
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'SELECT') {
            return;
        }

        const isZ = e.key.toLowerCase() === 'z';
        const isY = e.key.toLowerCase() === 'y';
        const isDelete = e.key === 'Delete' || e.key === 'Del';
        const isNumpadMinus = e.code === 'NumpadSubtract'; // Numpad - key

        // 1. UNDO: Triggers on Ctrl+Z OR Ctrl+Alt+Z
        if (isZ && e.ctrlKey) {
            e.preventDefault();
            if (typeof StorageEngine !== 'undefined') {
                StorageEngine.executeUndo();
            }
        }

        // 2. REDO: Triggers on Ctrl+Y
        if (isY && e.ctrlKey && !e.altKey) {
            e.preventDefault();
            if (typeof StorageEngine !== 'undefined') {
                StorageEngine.executeRedo();
            }
        }

        // 3. NUMPAD MINUS INSTANT HOVER VAPORIZATION
        if (isNumpadMinus) {
            e.preventDefault();
            e.stopPropagation();

            if (window.hoveredCard) {
                if (window.hoveredCard.classList.contains('selected')) {
                    // Delete all currently highlighted cards immediately
                    const selectedCards = Array.from(board.querySelectorAll('.magnet-card.selected'));
                    selectedCards.forEach(c => c.remove());
                } else {
                    // Delete only this targeted card immediately
                    window.hoveredCard.remove();
                }
                
                window.hoveredCard = null;
                window.updateClearButtonState();
                if (typeof StorageEngine !== 'undefined') StorageEngine.saveActiveDraft();
            }
        }

        // 4. DELETE SELECTIONS: Keyboard triggers
        if (isDelete) {
            const selectedCards = Array.from(board.querySelectorAll('.magnet-card.selected'));
            const selectedBadges = Array.from(document.querySelectorAll('.custom-badge-container.selected-badge'));

            if (selectedCards.length > 0) {
                e.preventDefault();
                // Resolved: Canvas board keyboard deletions are now instant with zero popups
                selectedCards.forEach(c => c.remove());
                window.updateClearButtonState();
                StorageEngine.saveActiveDraft();
            } else if (selectedBadges.length > 0) {
                e.preventDefault();
                // Resolved: Saved dictionary deletions strictly retain modal warning popups
                const confirmed = await window.customConfirm("Delete Saved Words", `Permanently delete all ${selectedBadges.length} selected words from your custom saved dictionary?`);
                if (confirmed) {
                    const wordsToRemove = selectedBadges.map(el => el.querySelector('.word-badge').textContent.trim().toLowerCase());
                    StorageEngine.customDictionary = StorageEngine.customDictionary.filter(w => !wordsToRemove.includes(w));
                    localStorage.setItem(StorageEngine.customDictionaryKey, JSON.stringify(StorageEngine.customDictionary));
                    StorageEngine.renderCustomDictionaryBank();
                    window.updateClearButtonState();
                }
        } else if (window.hoveredDictBadge) {
            // Allow Delete key to work on hovered item if nothing is selected
            const word = window.hoveredDictBadge.querySelector('.word-badge').textContent.trim().toLowerCase();
            const confirmed = await window.customConfirm("Remove Word", `Remove "${word}" from your saved dictionary?`);
            if (confirmed) {
                StorageEngine.customDictionary = StorageEngine.customDictionary.filter(w => w !== word);
                localStorage.setItem(StorageEngine.customDictionaryKey, JSON.stringify(StorageEngine.customDictionary));
                StorageEngine.renderCustomDictionaryBank();
            } else if (window.hoveredDictBadge) {
                // Allow Delete key to work on hovered item if nothing is selected
                const word = window.hoveredDictBadge.querySelector('.word-badge').textContent.trim().toLowerCase();
                const confirmed = await window.customConfirm("Remove Word", `Remove "${word}" from your saved dictionary?`);
                if (confirmed) {
                    StorageEngine.customDictionary = StorageEngine.customDictionary.filter(w => w !== word);
                    localStorage.setItem(StorageEngine.customDictionaryKey, JSON.stringify(StorageEngine.customDictionary));
                    StorageEngine.renderCustomDictionaryBank();
                }
            }
            }
        }
    });

    // ==========================================================================
    // 12. CANVAS SYSTEM UTILITIES (COPY TEXT, CLEAR BOARD, CLEAR DICTIONARY, SAVE BOARD)
    // ==========================================================================
    copyTextBtn.addEventListener('click', () => {
        const cards = Array.from(board.querySelectorAll('.magnet-card'));
        if (cards.length === 0) return;

        cards.sort((a, b) => {
            const topA = parseFloat(a.style.top);
            const topB = parseFloat(b.style.top);
            const leftA = parseFloat(a.style.left);
            const leftB = parseFloat(b.style.left);

            if (Math.abs(topA - topB) < 15) {
                return leftA - leftB;
            }
            return topA - topB;
        });

        let words = [];
        let currentTop = parseFloat(cards[0].style.top);
        let currentLine = [];

        cards.forEach(card => {
            const t = parseFloat(card.style.top);
            if (Math.abs(t - currentTop) >= 15) {
                words.push(currentLine.join(' '));
                currentLine = [];
                currentTop = t;
            }
            currentLine.push(card.textContent);
        });
        if (currentLine.length > 0) {
            words.push(currentLine.join(' '));
        }

        const exportedText = words.join('\n');
        navigator.clipboard.writeText(exportedText).then(() => {
            window.customAlert("Copied to Clipboard", "Your canvas lyrics have been copied to your clipboard.");
        }).catch(err => {
            console.error("Failed to copy clipboard data: ", err);
        });
    });

    clearBoardBtn.addEventListener('click', async () => {
        // Aligned: "Clear Board" strictly clears whole board. Custom button handles selections
        const confirmed = await window.customConfirm("Clear Board", "Are you sure you want to clear all active word cards from your canvas?");
        if (confirmed) {
            board.innerHTML = '';
            StorageEngine.saveActiveDraft();
        }
    });

    exportDictTxtBtn.addEventListener('click', () => {
        StorageEngine.exportDictionaryAsTXT();
    });

    clearDictBtn.addEventListener('click', async () => {
        const confirmed = await window.customConfirm("Clear Dictionary", "Are you sure you want to permanently clear your saved custom vocabulary dictionary? This action cannot be undone.");
        if (confirmed) {
            StorageEngine.clearCustomDictionary();
        }
    });

// Integrated: Save As click handler (Prompts for custom named save) [1]
    if (saveAsBtn) {
        saveAsBtn.addEventListener('click', async () => {
            const activeProject = StorageEngine.projects.find(p => p.id === StorageEngine.activeProjectId);
            if (!activeProject) return;

            // Aligned: Inserts a line break and styled bold warning using the orange variable [1]
            const warningMessage = "Enter a new name for this draft:<br><b style='color: var(--neon-orange); display: inline-block; margin-top: 8px;'>(Warning: Use New Name or Overwrite)</b>";

            // Calls our custom in-window prompt, pre-populated with active draft name [1]
            const newName = await window.customPrompt("Save As", warningMessage, activeProject.name);
            if (newName && newName.trim()) {
                StorageEngine.saveActiveProjectAs(newName.trim());
            }
        });
    }

    // Integrated: New Draft Safety Shield (Prompts for custom named save on unsaved changes)
    if (createDraftBtn) {
        // We override the default click listener to add our safety check first
        createDraftBtn.replaceWith(createDraftBtn.cloneNode(true)); // Strip old listener cleanly
        const freshCreateBtn = document.getElementById('create-draft-btn');
        
        freshCreateBtn.addEventListener('click', async () => {
            const name = newDraftInput.value.trim();
            if (!name) return;

            // If there are unsaved changes on the active board, prompt to save them first
            if (window.hasUnsavedChanges) {
                const confirmed = await window.customConfirm("Unsaved Changes", "You have unsaved changes on your active board. Would you like to save them first before starting a new sketch?");
                if (confirmed) {
                    const activeProject = StorageEngine.projects.find(p => p.id === StorageEngine.activeProjectId);
                    // Calls custom in-window prompt, pre-populated with active draft name
                    const newName = await window.customPrompt("Save As", "Enter a name to save your active draft:", activeProject ? activeProject.name : 'sketch');
                    if (newName && newName.trim()) {
                        StorageEngine.saveActiveProjectAs(newName.trim());
                    } else {
                        return; // Cancel creation if they cancelled the save
                    }
                }
            }

            // Start completely fresh
            window.hasUnsavedChanges = false;
            StorageEngine.createDraft(name);
            newDraftInput.value = '';
        });
    }

    // ==========================================================================
    // 13. THEME-AWARE DYNAMIC PNG SNAPSHOT ENGINE
    // ==========================================================================
    exportPngBtn.addEventListener('click', () => {
        const cards = Array.from(board.querySelectorAll('.magnet-card'));
        if (cards.length === 0) {
            window.customAlert("Empty Board", "The board is empty. Spawn some words first before exporting.");
            return;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const width = board.offsetWidth || 800;
        const height = board.offsetHeight || 480;
        canvas.width = width;
        canvas.height = height;

        const bodyStyle = getComputedStyle(document.body);
        const bgMain = bodyStyle.getPropertyValue('--bg-main').trim() || '#040409';
        const cardAlt = bodyStyle.getPropertyValue('--bg-card-alt').trim() || '#161633';
        const textPrimary = bodyStyle.getPropertyValue('--text-primary').trim() || '#ffffff';
        const theme2 = bodyStyle.getPropertyValue('--theme-color-2').trim() || '#ff7a00';
        const theme3 = bodyStyle.getPropertyValue('--theme-color-3').trim() || '#2b2b3d';

        ctx.fillStyle = bgMain;
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = 'rgba(157, 78, 221, 0.05)';
        ctx.lineWidth = 1;
        const gridSize = 20;
        for (let x = 0; x < width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        for (let y = 0; y < height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        cards.forEach(card => {
            const cardX = parseFloat(card.style.left) || 0;
            const cardY = parseFloat(card.style.top) || 0;
            const cardW = card.offsetWidth;
            const cardH = card.offsetHeight;
            const isCustom = card.classList.contains('custom-word');

            const borderStroke = isCustom ? theme2 : theme3;

            ctx.fillStyle = cardAlt;
            ctx.beginPath();
            ctx.roundRect(cardX, cardY, cardW, cardH, 4);
            ctx.fill();

            ctx.strokeStyle = borderStroke;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            ctx.fillStyle = textPrimary;
            ctx.font = 'bold 13px Consolas, Courier New, monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(card.textContent, cardX + (cardW / 2), cardY + (cardH / 2) + 1);
        });

        const activeProject = StorageEngine.projects.find(p => p.id === StorageEngine.activeProjectId);
        const rawName = activeProject ? activeProject.name : 'sketch';
        const safeName = rawName.toLowerCase().replace(/[^a-z0-9]/g, '_');

        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `the_lab_${safeName}_snapshot.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
});