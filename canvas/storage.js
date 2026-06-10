/**
 * THE LAB // storage.js
 * Persistent Multi-Draft & User-Curated Dictionary Engine
 */

const StorageEngine = {
    storageKey: 'the_lab_lyric_projects',
    activeProjectIdKey: 'the_lab_active_project_id',
    customDictionaryKey: 'the_lab_custom_dictionary', // Dynamic user vocabulary cache [1]
    
    projects: [],
    activeProjectId: null,
    customDictionary: [], // Active vocabulary array in memory [1]
    
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

        // 2. Load custom dictionary bank [1]
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
     * Appends a single word to the persistent dictionary list, preventing duplicates [1]
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
     * Merges an array of words (like a "Save All" query) into the custom dictionary in one action [1]
     */
    saveAllToCustomDictionary(wordsArray) {
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
            alert(`Added ${addedCount} new words to your custom dictionary.`);
        } else {
            alert("All suggested words are already stored in your custom dictionary.");
        }
    },

    /**
     * Generates and downloads a clean .txt file of your custom vocabulary [1]
     */
    exportDictionaryAsTXT() {
        if (this.customDictionary.length === 0) {
            alert("Your custom dictionary is currently empty.");
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
     * Renders the custom saved words inside their own distinct UI section [1]
     */
    renderCustomDictionaryBank() {
        const bankContainer = document.getElementById('custom-user-dictionary-bank');
        if (!bankContainer) return;

        bankContainer.innerHTML = '';
        
        if (this.customDictionary.length === 0) {
            bankContainer.innerHTML = '<span style="font-size:12px; font-style:italic; color:var(--text-secondary);">Dictionary is empty. Click ＋ on suggestions or drag cards here to collect words.</span>';
            return;
        }

        // Sort alphabetically for quick reference
        const sorted = [...this.customDictionary].sort();

        sorted.forEach(word => {
            const badge = document.createElement('div');
            badge.className = 'word-badge';
            badge.textContent = word;
            badge.style.borderColor = 'var(--neon-green)';

            // Clicking the custom word spawns it on the canvas
            badge.addEventListener('click', () => {
                if (typeof window.spawnCardElement === 'function' && typeof PlacementEngine !== 'undefined') {
                    const coords = PlacementEngine.findOpenPosition(word, this.boardElement);
                    window.spawnCardElement(word, true, coords.left, coords.top);
                    this.saveActiveDraft();
                }
            });

            // Double click in the dictionary bank to delete the word from your list
            badge.addEventListener('dblclick', (e) => {
                e.stopPropagation();
                if (confirm(`Remove "${word}" from your saved custom dictionary?`)) {
                    this.customDictionary = this.customDictionary.filter(w => w !== word);
                    localStorage.setItem(this.customDictionaryKey, JSON.stringify(this.customDictionary));
                    this.renderCustomDictionaryBank();
                }
            });

            bankContainer.appendChild(badge);
        });
    },

    /* --- BASIC DRAFT FLOW CONTROLLERS --- */

    saveActiveDraft() {
        if (!this.activeProjectId || !this.boardElement) return;

        const cards = Array.from(this.boardElement.querySelectorAll('.magnet-card'));
        const wordData = cards.map(card => {
            return {
                text: card.textContent,
                isCustom: card.classList.contains('custom-word'),
                left: card.style.left,
                top: card.style.top
            };
        });

        const pIndex = this.projects.findIndex(p => p.id === this.activeProjectId);
        if (pIndex !== -1) {
            this.projects[pIndex].words = wordData;
            this.projects[pIndex].lastUpdated = Date.now();
        }

        localStorage.setItem(this.storageKey, JSON.stringify(this.projects));
        this.triggerVisualSavedIndicator();
    },

    loadActiveDraft() {
        if (!this.activeProjectId || !this.boardElement) return;

        const project = this.projects.find(p => p.id === this.activeProjectId);
        if (!project) return;

        this.boardElement.innerHTML = '';

        project.words.forEach(w => {
            if (typeof window.spawnCardElement === 'function') {
                window.spawnCardElement(w.text, w.isCustom, parseFloat(w.left), parseFloat(w.top));
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

        this.syncDropdown();
        this.loadActiveDraft();
    },

    switchProject(projectId) {
        this.activeProjectId = projectId;
        localStorage.setItem(this.activeProjectIdKey, projectId);
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
            opt.textContent = p.name;
            if (p.id === this.activeProjectId) opt.selected = true;
            this.selectElement.appendChild(opt);
        });
    },

    triggerVisualSavedIndicator() {
        const statusEl = document.getElementById('save-status');
        if (!statusEl) return;
        statusEl.style.display = 'inline-block';
        if (this.statusTimeout) clearTimeout(this.statusTimeout);
        this.statusTimeout = setTimeout(() => { statusEl.style.display = 'none'; }, 1000);
    }
};