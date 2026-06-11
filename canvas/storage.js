/**
 * THE LAB // storage.js
 * Persistent Multi-Draft, History Stack & User-Curated Dictionary Engine (True "Save As" Duplicator)
 */

const StorageEngine = {
    storageKey: 'the_lab_lyric_projects',
    activeProjectIdKey: 'the_lab_active_project_id',
    customDictionaryKey: 'the_lab_custom_dictionary', // Dynamic user vocabulary cache
    
    projects: [],
    activeProjectId: null,
    customDictionary: [], // Active vocabulary array in memory
    
    // Internal History Stacks
    undoStack: [],
    redoStack: [],
    
    selectElement: null,
    boardElement: null,
    statusTimeout: null,

    /**
     * Initializes the storage arrays and loads custom word cache
     */
    init(selectElement, boardElement) {
        this.selectElement = selectElement;
        this.boardElement = boardElement;

        // 1. Load song drafts
        const rawProjects = localStorage.getItem(this.storageKey);
        if (rawProjects) {
            try { this.projects = JSON.parse(rawProjects); } 
            catch (e) { this.projects = []; }
        }
        if (this.projects.length === 0) {
            this.createDraft('Untitled Sketch');
        }

        this.activeProjectId = localStorage.getItem(this.activeProjectIdKey);
        if (!this.activeProjectId || !this.projects.some(p => p.id === this.activeProjectId)) {
            this.activeProjectId = this.projects[0].id;
            localStorage.setItem(this.activeProjectIdKey, this.activeProjectId);
        }

        // 2. Load custom dictionary bank
        const rawDict = localStorage.getItem(this.customDictionaryKey);
        if (rawDict) {
            try { this.customDictionary = JSON.parse(rawDict); }
            catch (e) { this.customDictionary = []; }
        }

        this.syncDropdown();
        this.loadActiveDraft();
        this.renderCustomDictionaryBank();
    },

    /**
     * Pushes a history state string onto the undo stack and clears redo stack
     */
    pushHistoryState(jsonString) {
        this.redoStack = [];
        const redoBtn = document.getElementById('redo-btn');
        if (redoBtn) redoBtn.disabled = true;

        this.undoStack.push(jsonString);
        
        // Enforce strict 4-step history cap
        if (this.undoStack.length > 4) {
            this.undoStack.shift();
        }

        const undoBtn = document.getElementById('undo-btn');
        if (undoBtn) undoBtn.disabled = false;
    },

    /**
     * Pops previous state and steps back
     */
    executeUndo() {
        if (this.undoStack.length === 0) return;

        const activeProject = this.projects.find(p => p.id === this.activeProjectId);
        if (!activeProject) return;

        // Push current active state to redo stack
        const currentState = JSON.stringify(activeProject.words);
        this.redoStack.push(currentState);
        
        const redoBtn = document.getElementById('redo-btn');
        if (redoBtn) redoBtn.disabled = false;

        // Pop state
        const previousState = JSON.parse(this.undoStack.pop());
        activeProject.words = previousState;

        // Resolved: Load first, save second to prevent current DOM overwrite loops
        this.loadActiveDraft();
        this.saveActiveDraft(true); // Pass true to bypass pushing history again

        const undoBtn = document.getElementById('undo-btn');
        if (undoBtn) undoBtn.disabled = this.undoStack.length === 0;
        
        if (typeof window.updateClearButtonState === 'function') {
            window.updateClearButtonState();
        }
    },

    /**
     * Pops next state and steps forward
     */
    executeRedo() {
        if (this.redoStack.length === 0) return;

        const activeProject = this.projects.find(p => p.id === this.activeProjectId);
        if (!activeProject) return;

        // Push current active state to undo stack
        const currentState = JSON.stringify(activeProject.words);
        this.undoStack.push(currentState);
        
        const undoBtn = document.getElementById('undo-btn');
        if (undoBtn) undoBtn.disabled = false;

        // Pop state
        const nextState = JSON.parse(this.redoStack.pop());
        activeProject.words = nextState;

        // Resolved: Load first, save second
        this.loadActiveDraft();
        this.saveActiveDraft(true);

        const redoBtn = document.getElementById('redo-btn');
        if (redoBtn) redoBtn.disabled = this.redoStack.length === 0;

        if (typeof window.updateClearButtonState === 'function') {
            window.updateClearButtonState();
        }
    },

    /**
     * Appends a single word to the persistent dictionary list, preventing duplicates
     */
    addWordToCustomDictionary(word) {
        const cleaned = word.trim().toLowerCase();
        if (!cleaned || this.customDictionary.includes(cleaned)) return;

        this.customDictionary.push(cleaned);
        localStorage.setItem(this.customDictionaryKey, JSON.stringify(this.customDictionary));
        
        this.renderCustomDictionaryBank();
        this.triggerVisualSavedIndicator();
    },

    /**
     * Merges an array of words (like a "Save All" query) into the custom dictionary
     */
    async saveAllToCustomDictionary(wordsArray) {
        if (!wordsArray || wordsArray.length === 0) return;

        let addedCount = 0;
        wordsArray.forEach(w => {
            const cleaned = w.trim().toLowerCase();
            if (cleaned && !this.customDictionary.includes(cleaned)) {
                this.customDictionary.push(cleaned);
                addedCount++;
            }
        });

        if (addedCount > 0) {
            localStorage.setItem(this.customDictionaryKey, JSON.stringify(this.customDictionary));
            this.renderCustomDictionaryBank();
            this.triggerVisualSavedIndicator();
            // Custom modal alert instead of browser alert
            await window.customAlert("Dictionary Updated", `Successfully added ${addedCount} new words to your custom dictionary.`);
        } else {
            await window.customAlert("Custom Dictionary", "All suggested words are already stored in your custom dictionary.");
        }
    },

    /**
     * Generates and downloads a clean .txt file of your custom vocabulary
     */
    async exportDictionaryAsTXT() {
        if (this.customDictionary.length === 0) {
            await window.customAlert("Empty Dictionary", "Your custom dictionary is currently empty. Add words first.");
            return;
        }

        const formattedText = this.customDictionary.sort().join('\r\n');
        const blob = new Blob([formattedText], { type: 'text/plain;charset=utf-8' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'the_lab_custom_dictionary.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    /**
     * Wipes out all saved words inside your custom vocabulary cache
     */
    clearCustomDictionary() {
        this.customDictionary = [];
        localStorage.setItem(this.customDictionaryKey, JSON.stringify(this.customDictionary));
        this.renderCustomDictionaryBank();
        this.triggerVisualSavedIndicator();
    },

    /**
     * Renders the custom saved words inside their own distinct UI section
     */
    renderCustomDictionaryBank() {
        const bankContainer = document.getElementById('custom-user-dictionary-bank');
        if (!bankContainer) return;

        bankContainer.innerHTML = '';
        
        if (this.customDictionary.length === 0) {
            bankContainer.innerHTML = '<span style="font-size:12px; font-style:italic; color:var(--text-secondary);">Dictionary is empty. Click suggestions or drag cards here to collect words.</span>';
            return;
        }

        const sorted = [...this.customDictionary].sort();

        sorted.forEach(word => {
            // Container for hover close positioning
            const badgeContainer = document.createElement('div');
            badgeContainer.className = 'custom-badge-container';
            badgeContainer.style.position = 'relative';
            badgeContainer.style.display = 'inline-block';

            const badge = document.createElement('div');
            badge.className = 'word-badge';
            badge.textContent = word;
            badge.style.borderColor = 'var(--neon-green)';

            // Clicking the custom word spawns it on the canvas
            badge.addEventListener('click', (e) => {
                // Interactive: Ctrl-Click / Cmd-Click multi-selection on dictionary badges
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    e.stopPropagation();
                    badgeContainer.classList.toggle('selected-badge');
                    
                    // Aligned: Updates the active/disabled status of your Delete Selected button
                    if (typeof window.updateClearButtonState === 'function') {
                        window.updateClearButtonState();
                    }
                    return;
                }

                if (typeof window.spawnCardElement === 'function' && typeof PlacementEngine !== 'undefined') {
                    const coords = PlacementEngine.findOpenPosition(word, this.boardElement);
                    window.spawnCardElement(word, true, coords.left, coords.top);
                    this.saveActiveDraft();
                }
            });

            // Clean Deletion: Tiny hover-X element decouples deletion from clicking
            const deleteIcon = document.createElement('span');
            deleteIcon.className = 'dictionary-badge-delete-x';
            deleteIcon.textContent = '✕';
            deleteIcon.title = "Delete from dictionary bank (Click to delete)";
            
            // Re-written: uses window.customConfirm to prevent browser alerts
            deleteIcon.addEventListener('click', async (e) => {
                e.stopPropagation(); // Stop card from spawning on board
                const confirmed = await window.customConfirm("Remove Word", `Are you sure you want to remove "${word}" from your saved custom dictionary?`);
                if (confirmed) {
                    this.customDictionary = this.customDictionary.filter(w => w !== word);
                    localStorage.setItem(this.customDictionaryKey, JSON.stringify(this.customDictionary));
                    this.renderCustomDictionaryBank();
                    if (typeof window.updateClearButtonState === 'function') {
                        window.updateClearButtonState();
                    }
                }
            });

            badgeContainer.appendChild(badge);
            badgeContainer.appendChild(deleteIcon);
            bankContainer.appendChild(badgeContainer);
        });
    },

    /* --- BASIC DRAFT FLOW CONTROLLERS --- */

    saveActiveDraft(isUndoRedoAction = false) {
        if (!this.activeProjectId || !this.boardElement) return;

        const cards = Array.from(this.boardElement.querySelectorAll('.magnet-card'));
        const wordData = cards.map(card => {
            return {
                // Aligned Fix: Read from clean custom dataset instead of textContent
                text: card.dataset.word || card.textContent.trim(), 
                isCustom: card.classList.contains('custom-word'),
                isSelected: card.classList.contains('selected'), // Persist selections
                left: card.style.left,
                top: card.style.top
            };
        });

        const pIndex = this.projects.findIndex(p => p.id === this.activeProjectId);
        if (pIndex !== -1) {
            // Push history state to undo stack before saving new changes
            if (!isUndoRedoAction) {
                const previousState = JSON.stringify(this.projects[pIndex].words);
                this.pushHistoryState(previousState);
                
                // Set unsaved changes flag on user modifications
                window.hasUnsavedChanges = true;
            }

            this.projects[pIndex].words = wordData;
            this.projects[pIndex].lastUpdated = Date.now();
        }

        localStorage.setItem(this.storageKey, JSON.stringify(this.projects));
        this.syncDropdown(); // Re-renders dropdown to immediately display "*"
    },

    loadActiveDraft() {
        if (!this.activeProjectId || !this.boardElement) return;

        const project = this.projects.find(p => p.id === this.activeProjectId);
        if (!project) return;

        this.boardElement.innerHTML = '';

        project.words.forEach(w => {
            if (typeof window.spawnCardElement === 'function') {
                const card = window.spawnCardElement(w.text, w.isCustom, parseFloat(w.left), parseFloat(w.top));
                if (card && w.isSelected) {
                    card.classList.add('selected');
                }
            }
        });
    },

    createDraft(name) {
        const uniqueId = 'project_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
        const newProject = {
            id: uniqueId,
            name: name || 'New Sketch',
            created: Date.now(),
            lastUpdated: Date.now(),
            words: []
        };

        this.projects.push(newProject);
        localStorage.setItem(this.storageKey, JSON.stringify(this.projects));

        this.activeProjectId = uniqueId;
        localStorage.setItem(this.activeProjectIdKey, uniqueId);

        // Wipe history on new draft creation
        this.undoStack = [];
        this.redoStack = [];
        const undoBtn = document.getElementById('undo-btn');
        const redoBtn = document.getElementById('redo-btn');
        if (undoBtn) undoBtn.disabled = true;
        if (redoBtn) redoBtn.disabled = true;

        this.syncDropdown();
        this.loadActiveDraft();
    },

    switchProject(projectId) {
        this.activeProjectId = projectId;
        localStorage.setItem(this.activeProjectIdKey, projectId);
        
        // Wipe history on draft switches
        this.undoStack = [];
        this.redoStack = [];
        const undoBtn = document.getElementById('undo-btn');
        const redoBtn = document.getElementById('redo-btn');
        if (undoBtn) undoBtn.disabled = true;
        if (redoBtn) redoBtn.disabled = true;

        this.loadActiveDraft();
    },

    deleteProject(projectId) {
        this.projects = this.projects.filter(p => p.id !== projectId);
        
        if (this.projects.length === 0) {
            this.createDraft('Untitled Sketch');
            return;
        }

        localStorage.setItem(this.storageKey, JSON.stringify(this.projects));

        if (this.activeProjectId === projectId) {
            this.activeProjectId = this.projects[0].id;
            localStorage.setItem(this.activeProjectIdKey, this.activeProjectId);
        }

        // Wipe history on deletion
        this.undoStack = [];
        this.redoStack = [];
        const undoBtn = document.getElementById('undo-btn');
        const redoBtn = document.getElementById('redo-btn');
        if (undoBtn) undoBtn.disabled = true;
        if (redoBtn) redoBtn.disabled = true;

        this.syncDropdown();
        this.loadActiveDraft();
    },

    syncDropdown() {
        if (!this.selectElement) return;
        this.selectElement.innerHTML = '';
        const sorted = [...this.projects].sort((a, b) => b.lastUpdated - a.lastUpdated);

        sorted.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.id;
            
            // If this is the active project and has unsaved changes, append "*"
            const isUnsaved = (p.id === this.activeProjectId && window.hasUnsavedChanges);
            opt.textContent = p.name + (isUnsaved ? ' *' : '');
            
            if (p.id === this.activeProjectId) opt.selected = true;
            this.selectElement.appendChild(opt);
        });
    },

/**
     * Deep-clones the active canvas layout under a new name, checking for existing overwrites [1]
     */
    async saveActiveProjectAs(newName) {
        const activeProject = this.projects.find(p => p.id === this.activeProjectId);
        const currentWords = activeProject ? JSON.parse(JSON.stringify(activeProject.words)) : []; // Deep-clone array [1]

        const cleanedName = newName.trim();

        // 1. Check if a project with the same name already exists in your local database [1]
        const existingProject = this.projects.find(p => p.name.toLowerCase() === cleanedName.toLowerCase());

        if (existingProject) {
            // Self-Save Check: If they typed the name of the project they are already working on, just save [1]
            if (existingProject.id === this.activeProjectId) {
                existingProject.name = cleanedName;
                window.hasUnsavedChanges = false;
                this.saveActiveDraft(true);
                this.syncDropdown();
                return;
            }

            // 2. Overwrite check: Trigger custom confirmation modal warning [1]
            const confirmed = await window.customConfirm("Overwrite Sketch", `A sketch named "${existingProject.name}" already exists. Do you want to overwrite it?`);
            if (!confirmed) {
                return; // Abort saving if they click Cancel [1]
            }

            // 3. Overwrite the existing project's card layout with our active layout [1]
            existingProject.words = currentWords;
            existingProject.lastUpdated = Date.now();

            // Switch active view to the overwritten project ID [1]
            this.activeProjectId = existingProject.id;
            localStorage.setItem(this.activeProjectIdKey, existingProject.id);
        } else {
            // 4. Create new duplicated project if the name is unique [1]
            const uniqueId = 'project_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
            const duplicatedProject = {
                id: uniqueId,
                name: cleanedName,
                created: Date.now(),
                lastUpdated: Date.now(),
                words: currentWords
            };

            this.projects.push(duplicatedProject);
            localStorage.setItem(this.storageKey, JSON.stringify(this.projects));

            // Switch view to the new project ID [1]
            this.activeProjectId = uniqueId;
            localStorage.setItem(this.activeProjectIdKey, uniqueId);
        }

        // Clear modified asterisk flag on successful saves [1]
        window.hasUnsavedChanges = false;

        localStorage.setItem(this.storageKey, JSON.stringify(this.projects));
        this.syncDropdown();
        this.loadActiveDraft();
        this.triggerVisualSavedIndicator();
    },

    /**
     * Serializes all song drafts, user dictionaries, and theme variables into a single downloadable JSON backup file
     */
    exportSystemBackup() {
        if (this.projects.length === 0) {
            window.customAlert("Empty Database", "You have no song drafts to backup.");
            return;
        }

        const backupData = {
            app_identifier: "the_lab_backup",
            version: "2.0",
            timestamp: Date.now(),
            active_project_id: this.activeProjectId,
            projects: this.projects,
            custom_dictionary: this.customDictionary,
            active_theme: localStorage.getItem('the_lab_active_theme') || 'theme-g910'
        };

        const jsonString = JSON.stringify(backupData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
        
        // Fetch active draft name, sanitize it into a safe filename, and append current date
        const activeProject = this.projects.find(p => p.id === this.activeProjectId);
        const rawName = activeProject ? activeProject.name : 'backup';
        const safeName = rawName.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_'); // Replaces spaces/asterisks with clean underscores
        
        const today = new Date().toISOString().slice(0, 10).replace(/-/g, '_');
        const fileName = `${safeName}_${today}.json`; // Compiles "[UserTitle]_[Date].json"

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    /**
     * Parses an uploaded JSON backup file and restores the entire workspace state
     * @param {File} file - The uploaded .json file
     */
    importSystemBackup(file) {
        if (!file) return;

        const reader = new FileReader(); // Native browser file reader
        
        reader.onload = async (e) => {
            try {
                const data = JSON.parse(e.target.result); // Parse uploaded text string

                // Security Check: Verify structural identifier
                if (data.app_identifier !== 'the_lab_backup') {
                    await window.customAlert("Invalid File", "This file is not a valid Lab backup configuration.");
                    return;
                }

                const confirmed = await window.customConfirm("Restore Backup", `Importing this backup will overwrite your current active database. Are you sure you want to load ${data.projects.length} drafts?`);
                if (confirmed) {
                    // Overwrite memory arrays
                    this.projects = data.projects;
                    this.customDictionary = data.custom_dictionary || [];
                    this.activeProjectId = data.active_project_id || data.projects[0].id;

                    // Write back into persistent browser storage
                    localStorage.setItem(this.storageKey, JSON.stringify(this.projects));
                    localStorage.setItem(this.customDictionaryKey, JSON.stringify(this.customDictionary));
                    localStorage.setItem(this.activeProjectIdKey, this.activeProjectId);
                    
                    if (data.active_theme) {
                        localStorage.setItem('the_lab_active_theme', data.active_theme);
                        document.body.className = data.active_theme;
                        const themeSelect = document.getElementById('theme-select');
                        if (themeSelect) themeSelect.value = data.active_theme;
                    }

                    // Refresh all GUI sub-components
                    this.syncDropdown();
                    this.loadActiveDraft();
                    this.renderCustomDictionaryBank();
                    if (typeof window.updateClearButtonState === 'function') {
                        window.updateClearButtonState();
                    }

                    await window.customAlert("Import Successful", `Successfully restored ${this.projects.length} song drafts and ${this.customDictionary.length} custom vocabulary words.`);
                }
            } catch (err) {
                console.error("JSON parse failed: ", err);
                window.customAlert("Corrupted File", "An error occurred while reading the file. The backup data is corrupted.");
            }
        };

        reader.readAsText(file); // Trigger async read
    },

    triggerVisualSavedIndicator() {
        const statusEl = document.getElementById('save-status');
        if (!statusEl) return;
        statusEl.style.display = 'inline-block';
        if (this.statusTimeout) clearTimeout(this.statusTimeout);
        this.statusTimeout = setTimeout(() => { statusEl.style.display = 'none'; }, 1000);
    }
};