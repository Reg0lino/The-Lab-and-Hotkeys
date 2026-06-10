# The Lab & FL Studio G910 Hotkeys Companion

A high-performance, lightweight, and interactive web application dashboard designed for local workstation rendering (via FL Studio's Fruity HTML NoteBook plugin) or cross-device deployment.

This repository features a unified, retro-glowing dark portal that links two separate, specialized companion wings: **SYS.TACTILE (The G910 Hotkey Trainer)** and **SYS.TOPLINE (The Songwriting Lab)**.

*   **Hosted Portal Link:** [https://reg0lino.github.io/The-Lab-and-Hotkeys/](https://reg0lino.github.io/The-Lab-and-Hotkeys/)
*   **Performance Profile:** Zero framework overhead, vanilla HTML5/CSS3, optimized PointerEvent calculations, and debounced API requests to prevent thread lockups inside DAWs [1].

---

## Complete Feature Set

### Module 1: The G910 Hotkey Trainer (SYS.TACTILE)
An interactive vector-svg workspace designed to build and test keyboard muscle memory for FL Studio.

*   **Tactile SVG Keyboard Canvas:** A fully responsive vector visualization mapped to the Logitech G910 keyboard layout. Includes visual press feedback matching physical keyboard states.
*   **G502 Custom Mouse Overlay:** An expandable overlay panel detailing custom mouse macro mappings based on Logitech G502 hardware inputs.
*   **Context-Driven Filtering:** A quick-select menu to filter and highlight hotkeys relative to active DAW contexts (Global, Playlist, Piano Roll, Mixer, Channel Rack, Browser).
*   **Active Modifier Indicators:** Clickable or keyboard-triggered Ctrl, Shift, and Alt HUD indicator toggles that dynamically update the visual labels rendered on the keys.
*   **The Learning Center:**
    *   *Endless Flashcards:* Finds random, context-based actions and prompts you to locate and click the correct key, featuring built-in voice-guided feedback and relative modifier warnings.
    *   *10-Question Quizzes:* Generates randomized multiple-choice tests to evaluate your FL Studio hotkey knowledge.
*   **Searchable Index:** A fully searchable list of FL Studio keyboard and mouse actions with hover-to-highlight keyboard routing.

### Module 2: The Songwriting Lab (SYS.TOPLINE)
A physical, drag-and-drop lyric composition board and top-line reference suite to bypass creative writer's block.

*   **Draggable Vocal Magnet Board:** An absolute-positioned, PointerEvent-driven canvas allowing you to grab, drag, and structure spawned word cards (compatible with mouse, trackpad, and touchscreen monitors).
*   **Off-Board Auto-Delete:** Dragging any card off the visual boundaries of the canvas instantly removes it from the board and triggers an auto-save.
*   **Drag-to-Save Target:** Dragging any card from the board and dropping it directly onto the Saved Dictionary container copies the word to your persistent cache and cleans the card off the board [1].
*   **Dynamic suggestions flexbox drawer:** Inputting a custom word automatically triggers a debounced background query to the Datamuse API, populating a static, scrollable 3-row drawer with up to 40 related words [1].
*   **Built-in API Debouncer:** A 500ms delay timer pauses queries while you are actively typing to protect performance and prevent API server limits [1].
*   **The 3-Button Spawner Suite:**
    *   *Add Typed:* Spawns the exact word currently written in your text field.
    *   *Add Top 5 / Top 10 / Top 20:* Spawns the selected slices of your active suggestions array onto your board in one click [1].
*   **🎲 Inspiration Dice Button:** Select an API mode, click the dice, and it automatically selects a random word from your active offline pools, injects it into your input field, and executes a live suggestion search [1].
*   **My Saved Vocabulary Bank:** A persistent, user-curated local storage bank. Includes hover-triggered close "✕" deletion badges to prevent click-overlap bugs, and a `.txt` file exporter [1].
*   **11 Dark-Mode Theme Presets:** Choose from 11 distinct styles (including the default G910 HUD, Synthwave, Matrix, Charcoal, and Industrial) to match your desktop aesthetic.
*   **Theory Reference Desk:**
    *   *Universal Progressions Directory:* Standard transposable Roman numeral formulas.
    *   *Guitar Tunings Drawer:* Side-by-side transcribed tabs for both Standard and Dropped configurations (Drop C, D Standard, Drop D, E Standard).
    *   *Vocal Meter & Pacing Guidelines:* Syllable stress templates (Trochaic, Iambic, Dactylic) to match rhythms over alternative drum loops.
    *   *Show, Don't Tell Sensory Table:* An immediate translation guide to convert abstract emotions into tactile proxies.

---

## File Directory Map

The companion application is organized into the following modular structures:

```text
The-Lab-and-Hotkeys/
│
├── index.html            <-- The Splash Landing Page Portal
├── style.css             <-- Splash page layout & visual animations
├── favicon.ico
├── .gitignore
├── README.md
├── todo.md
│   
├── hotkeys/              <-- SYS.TACTILE (Hotkey Trainer Folder)
│   ├── index.html        
│   ├── style.css         
│   ├── app.js            
│   ├── config.js         
│   └── data.js           
│   
└── canvas/               <-- SYS.TOPLINE (The Lab Folder)
    ├── index.html        
    ├── style.css         
    ├── themes.css        
    ├── app.js            
    ├── drag.js           
    ├── placement.js      
    ├── reference.js      
    ├── storage.js        
    └── data/             <-- Dynamic JSON directories
        ├── chords/       <-- 12 Chromatic guitar key transcriptions
        ├── progressions/ <-- Progression paths JSON files
        └── word_pools/   <-- Offline static word dictionaries [1]