/**
 * THE LAB // reference.js
 * Dynamic Chord Progression Reference Engine
 */

const ReferenceEngine = {
    dropdownElement: null,
    tableBodyElement: null,
    activeProgressionList: [],

    // Offline built-in backup directories to prevent DAW lockouts
    fallbackProgressions: {
        'core_minor_major': [
            { name: "The Epic Walk-Up", formula: "i - VI - VII - i", keys: "Am - F - C - Am", vibe: "Driving, massive, melancholic alternative rock backbone." },
            { name: "The Bleak Modal Loop", formula: "i - i - v - iv", keys: "Am - Am - Em - Dm", vibe: "Bleak, cold, and hypnotic; strips out classical major resolutions." },
            { name: "The Brooding Valley", formula: "i - bVI - iv - bVI", keys: "Am - F - Dm - F", vibe: "Brooding, slow, and moody; ideal for sustained, dragging verses." },
            { name: "The Ethereal Shimmer", formula: "I - IV - vi - V", keys: "A - D - F#m - E", vibe: "Bittersweet, nostalgic shoegaze or dream-pop lift." },
            { name: "The Cinematic Rise", formula: "i - iv - v - III", keys: "Am - Dm - Em - C", vibe: "Step from dark valley paths into a vast major key clearing." },
            { name: "The Tension Wave", formula: "i - V - bIII - iv - V", keys: "Am - E - C - Dm - E", vibe: "Utilizes a major V chord for extreme chromatic tension." }
        ],
        'shoegaze_fuzz_loops': [
            { name: "Saturated 6/9 Shimmer", formula: "I(6/9) - IV(6/9) - vi9 - V6", keys: "C6/9 - F6/9 - Am9 - G6", vibe: "Massive fuzz wash. Extensions generate beautiful, dreamy ambient shoegaze spaces." },
            { name: "The Cascading Descent", formula: "i - III - v/VII - VI", keys: "Cm - Eb - Gm/Bb - Ab", vibe: "Midwest Emo/Math Rock. Smooth voice-leading with open top strings ringing." },
            { name: "The Sinking Valley", formula: "iv - i - bVI - bIII", keys: "Em - Bm - G - D", vibe: "Slowcore drag. Sinking feel ideal for slow-tempo low-end weight." }
        ],
        'lofi_neo_soul': [
            { name: "Lo-Fi Jazz Nostalgia", formula: "ii7 - V9 - Imaj7 - IVmaj7", keys: "Dm7 - G9 - Cmaj7 - Fmaj7", vibe: "Relaxing, nostalgic, rainy jazz-hop structure." },
            { name: "Rainy Day Soul Loop", formula: "i9 - bVImaj7 - iv7 - bIImaj7", keys: "Cm9 - Abmaj7 - Fm7 - Dbmaj7", vibe: "Deeply melancholic lofi foundation. Extended intervals add warmth." }
        ],
        'punk_hardcore': [
            { name: "The Classic Anthem", formula: "I - V - vi - IV", keys: "C - G - Am - F", vibe: "The foundation of pop-punk. Upbeat, catchy, and high energy." },
            { name: "The Hardcore Stomp", formula: "i - bVI - bVII - i", keys: "Am - F - G - Am", vibe: "Relentless and driving. The 'wall of sound' for heavy verses." },
            { name: "The Minor Descent", formula: "i - VII - VI - V", keys: "Am - G - F - E", vibe: "Dramatic and urgent." },
            { name: "The Gritty Stomp", formula: "I - bVII - IV", keys: "A - G - D", vibe: "Raw, blues-punk swagger." },
            { name: "The No-Frills Rocker", formula: "I - IV - V - IV", keys: "G - C - D - C", vibe: "Pure Ramones-style energy." }
        ],
        'mathcore_alt': [
            { name: "The Jarring Shift", formula: "i - bII - V - i", keys: "Am - Bb - E - Am", vibe: "Angular and unsettling." },
            { name: "The Tritone Stab", formula: "i - bV - i", keys: "Cm - Gb - Cm", vibe: "Brutal and unstable." },
            { name: "The Chromatic Climb", formula: "i - bII - I (major)", keys: "Dm - Eb - F", vibe: "Disorienting chromatic movement." },
            { name: "The Nervous Loop", formula: "i - bIII - bVII - IV", keys: "Em - G - D - A", vibe: "Creates a sense of unease." }
        ],
        'lofi_trip_hop': [
            { name: "Nostalgic Chill", formula: "ii7 - V7 - Imaj7 - IVmaj7", keys: "Dm7 - G7 - Cmaj7 - Fmaj7", vibe: "The classic lo-fi 'rainy day' feel." },
            { name: "The Trip-Hop Drag", formula: "i - bVI - iv - v", keys: "Cm - Ab - Fm - Gm", vibe: "Dark, moody, and heavy." },
            { name: "Bittersweet Soul", formula: "i7 - IV7 - bVIImaj7", keys: "Bbm7 - Eb7 - Abmaj7", vibe: "A smooth, soulful loop." },
            { name: "The Hazy Loop", formula: "Imaj7 - vi7 - ii7 - V7", keys: "Cmaj7 - Am7 - Dm7 - G7", vibe: "Hazy, dream-like atmosphere." }
        ],
        'dream_pop': [
            { name: "The Pastel Wash", formula: "Imaj7 - IVmaj7", keys: "Cmaj7 - Fmaj7", vibe: "Slow, wide, and sparkly. Pure ethereal atmosphere." },
            { name: "Nostalgic Sparkle", formula: "I - vi - IV - V", keys: "G - Em - C - D", vibe: "Retro 50s feel drenched in chorus and reverb." },
            { name: "Sun-Drenched Loop", formula: "IV - V - iii - vi", keys: "F - G - Em - Am", vibe: "Warm but melancholic. Sounds like a fading summer." }
        ],
        'hiphop_dnb': [
            { name: "The Boom-Bap Vamp", formula: "i7 - iv7", keys: "Am7 - Dm7", vibe: "The foundation of classic 90s hip hop. Deeply loopable." },
            { name: "Phrygian Menace", formula: "i - bII", keys: "Em - F", vibe: "Ominous and aggressive. The 'dark' sound of DnB and Neurofunk." },
            { name: "The Soul Sample", formula: "vi7 - ii7 - V7 - Imaj7", keys: "Am7 - Dm7 - G7 - Cmaj7", vibe: "Dusty, jazzy, and sophisticated. Great for boom-bap." },
            { name: "The Drill Menace", formula: "i - bVI", keys: "Bm - G", vibe: "Minimal, heavy, and cold. Perfect for modern drill or dark trap." }
        ],
        'pop_anthems': [
            { name: "The Emotional Powerhouse", formula: "vi - IV - I - V", keys: "Am - F - C - G", vibe: "The most successful progression in modern pop history. Instant resonance." },
            { name: "The Upbeat Bounce", formula: "IV - V - vi - I", keys: "F - G - Am - C", vibe: "Driving, optimistic, and radio-ready." },
            { name: "The Borrowed Heart", formula: "I - iii - IV - iv", keys: "C - Em - F - Fm", vibe: "The minor iv (Fm) at the end adds a sophisticated 'sting' of sadness." }
        ]
    },

    /**
     * Initializes the progressions selector and loads the default dataset
     */
    init(dropdown, tableBody) {
        this.dropdownElement = dropdown;
        this.tableBodyElement = tableBody;

        if (!this.dropdownElement || !this.tableBodyElement) return;

        // Listen for directory changes
        this.dropdownElement.addEventListener('change', () => {
            this.switchDirectory(this.dropdownElement.value);
        });

        // Load default directory
        this.switchDirectory('core_minor_major');
    },

    /**
     * Switches the active progressions directory (fetching JSON with offline fallback)  .
     */
    switchDirectory(directoryId) {
        // Attempt to fetch from external JSON file first (GitHub Pages or local server)  .
        const url = `data/progressions/${directoryId}.json`;

        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('File not found');
                return response.json();
            })
            .then(data => {
                this.activeProgressionList = data;
                this.renderProgressions();
            })
            .catch(err => {
                // Fallback to local hardcoded database if offline  .
                if (this.fallbackProgressions[directoryId]) {
                    this.activeProgressionList = this.fallbackProgressions[directoryId];
                    this.renderProgressions();
                } else {
                    console.error("Progression directory load failed: ", err);
                }
            });
    },

    /**
     * Renders loaded progressions into the reference table
     */
    renderProgressions() {
        this.tableBodyElement.innerHTML = '';

        if (this.activeProgressionList.length === 0) {
            this.tableBodyElement.innerHTML = '<tr><td colspan="4" style="text-align:center; font-style:italic;">No progressions loaded.</td></tr>';
            return;
        }

        this.activeProgressionList.forEach(p => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td style="font-weight: 700; color: var(--text-primary);">${p.name}</td>
                <td class="highlight-purple" style="font-family: var(--font-mono); font-weight: bold;">${p.formula}</td>
                <td class="highlight-cyan" style="font-family: var(--font-mono);">${p.keys}</td>
                <td style="font-size: 13px;">${p.vibe}</td>
            `;

            this.tableBodyElement.appendChild(row);
        });
    }
};