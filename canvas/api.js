/**
 * THE LAB // api.js
 * Debounced Multi-Query API Engine (Includes Dynamic Local Particles Bypass)
 */

const APIEngine = {
    debounceTimer: null,
    debounceDelay: 500, // Wait 500ms after typing stops [1]
    maxSuggestions: 40,  // Keep suggestions exactly at 40 words [1]
    
    inputElement: null,
    modeSelectElement: null,
    suggestionsContainer: null,
    suggestionsListElement: null,
    saveAllBtnElement: null,
    
    currentSuggestions: [],

    /**
     * Initializes the API event listeners and UI bindings
     */
    init(input, modeSelect, container, list, saveAllBtn) {
        this.inputElement = input;
        this.modeSelectElement = modeSelect;
        this.suggestionsContainer = container;
        this.suggestionsListElement = list;
        this.saveAllBtnElement = saveAllBtn;

        if (!this.inputElement || !this.modeSelectElement) return;

        this.inputElement.addEventListener('input', () => {
            clearTimeout(this.debounceTimer);
            
            // Bypass input changes if currently looking up local particles [1]
            if (this.modeSelectElement.value === 'local_particles') {
                return;
            }

            const val = this.inputElement.value.trim();
            if (val.length < 2) {
                this.hideSuggestions();
                return;
            }

            this.debounceTimer = setTimeout(() => {
                this.query(val, this.modeSelectElement.value);
            }, this.debounceDelay);
        });

        this.modeSelectElement.addEventListener('change', () => {
            const val = this.inputElement.value.trim();
            
            // If local particles selected, ignore search bar and fetch all 200 immediately [1]
            if (this.modeSelectElement.value === 'local_particles') {
                this.query('', 'local_particles');
                return;
            }

            if (val.length >= 2) {
                this.query(val, this.modeSelectElement.value);
            } else {
                this.hideSuggestions();
            }
        });

        if (this.saveAllBtnElement) {
            this.saveAllBtnElement.addEventListener('click', () => this.saveAllToBank());
        }
    },

    /**
     * Executes the debounced fetch request or local bypass [1]
     */
    query(term, mode) {
        // Local Particles Bypass: load directly from the local word pool [1]
        if (mode === 'local_particles') {
            const url = 'data/word_pools/particles.json';
            fetch(url)
                .then(response => {
                    if (!response.ok) throw new Error();
                    return response.json();
                })
                .then(words => {
                    // Map local array to standard Datamuse object format
                    const formatted = words.map(w => { return { word: w }; });
                    this.currentSuggestions = formatted;
                    this.renderSuggestions(formatted); // Allow rendering all 200 [1]
                })
                .catch(() => {
                    this.suggestionsListElement.innerHTML = '<span style="font-size:12px; font-style:italic; color:var(--neon-orange);">Offline: Please make sure canvas/data/word_pools/particles.json exists.</span>';
                });
            return;
        }

        let queryParam = '';
        switch(mode) {
            case 'means_like':        queryParam = `ml=${encodeURIComponent(term)}`; break; [1]
            case 'perfect_rhyme':     queryParam = `rel_rhy=${encodeURIComponent(term)}`; break; [1]
            case 'slant_rhyme':       queryParam = `rel_nry=${encodeURIComponent(term)}`; break; [1]
            case 'consonant_match':   queryParam = `rel_cns=${encodeURIComponent(term)}`; break; [1]
            case 'triggers':          queryParam = `rel_trg=${encodeURIComponent(term)}`; break; [1]
            case 'adjectives_for':    queryParam = `rel_jjb=${encodeURIComponent(term)}`; break; [1]
            case 'nouns_for':         queryParam = `rel_jja=${encodeURIComponent(term)}`; break; [1]
            case 'synonyms':          queryParam = `rel_syn=${encodeURIComponent(term)}`; break; [1]
            case 'antonyms':          queryParam = `rel_ant=${encodeURIComponent(term)}`; break; [1]
            default:                  queryParam = `ml=${encodeURIComponent(term)}`;
        }

        const url = `https://api.datamuse.com/words?${queryParam}&md=s&max=${this.maxSuggestions}`;

        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('API server unavailable');
                return response.json();
            })
            .then(data => {
                this.currentSuggestions = data;
                this.renderSuggestions(data); // Constrained to 40 suggestions [1]
            })
            .catch(err => {
                console.warn("Connection offline or API failed: ", err);
                this.hideSuggestions();
            });
    },

    /**
     * Renders suggested words as flat, compact, spacer-efficient badges [1]
     */
    renderSuggestions(data) {
        if (!this.suggestionsListElement) return;
        this.suggestionsListElement.innerHTML = '';

        if (!data || data.length === 0) {
            this.hideSuggestions();
            return;
        }

        data.forEach(item => {
            const word = item.word;
            const syllables = item.numSyllables || 1;

            // Resolved: Renders as flat badges directly inside the container [1]
            const badge = document.createElement('div');
            badge.className = 'word-badge';
            badge.textContent = word;
            badge.title = `${syllables} syllables`;
            
            // Clicking the suggestion spawns it on the canvas
            badge.addEventListener('click', () => {
                if (typeof window.spawnCardElement === 'function' && typeof PlacementEngine !== 'undefined') {
                    const coords = PlacementEngine.findOpenPosition(word, DragEngine.canvasBoard);
                    window.spawnCardElement(word, false, coords.left, coords.top);
                    if (typeof StorageEngine !== 'undefined') StorageEngine.saveActiveDraft();
                }
            });

            this.suggestionsListElement.appendChild(badge);
        });

        if (this.suggestionsContainer) {
            this.suggestionsContainer.style.display = 'block';
        }
    },

    /**
     * Appends all suggested terms to your custom dictionary in one action [1]
     */
    saveAllToBank() {
        if (this.currentSuggestions.length === 0) return;
        
        const wordsOnly = this.currentSuggestions.map(item => item.word);
        if (typeof StorageEngine !== 'undefined') {
            StorageEngine.saveAllToCustomDictionary(wordsOnly);
        }
    },

    hideSuggestions() {
        if (this.suggestionsContainer) {
            this.suggestionsContainer.style.display = 'none';
        }
        this.currentSuggestions = [];
    }
};