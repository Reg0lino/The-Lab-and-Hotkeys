# The Lab & FL Studio G910 Hotkeys Companion

A high-performance, lightweight, and interactive web application dashboard designed for local workstation rendering (via FL Studio's Fruity HTML NoteBook plugin) or cross-device deployment.

This repository features a unified, retro-glowing dark portal that links two separate, specialized companion wings: **SYS.TACTILE (The G910 Hotkey Trainer)** and **SYS.TOPLINE (The Songwriting Lab)**.

*   **Hosted Portal Link:** [https://reg0lino.github.io/The-Lab-and-Hotkeys/](https://reg0lino.github.io/The-Lab-and-Hotkeys/)
*   **Performance Profile:** Zero framework overhead, vanilla HTML5/CSS3, optimized PointerEvent calculations, and debounced API requests to prevent thread lockups inside DAWs [1].

---

## THIS APP IS MOSTLY JUST FOR MYSELF BUT IF YOU ALSO WANT TO KNOW THE BASIC HOTKEYS AND NEED HELP WITH WRITING THEN GO AHEAD AND USE IT!!

---


## Complete Feature Set

### 1. The Home Portal (Splash Page)
A responsive landing portal positioned at the root of the repository, enabling quick navigation to either workspace.
*   **Retro Terminal Layout:** Sleek, dark-mode styling utilizing a pitch-black background, deep-charcoal card outlines, and glowing yellow typography.
*   **Dual-Choice Dashboard:** Widescreen portal options mapped to `hotkeys/index.html` and `canvas/index.html` with smooth hover-scale transitions.

### 2. The G910 Hotkey Trainer (SYS.TACTILE)
An interactive vector-svg workspace designed to build and test keyboard muscle memory for FL Studio.

*   **Tactile SVG Keyboard Canvas:** A responsive vector visualization mapped to the Logitech G910 keyboard layout. Includes visual press feedback matching physical keyboard states.
*   **G502 Custom Mouse Overlay:** An expandable overlay panel detailing custom mouse macro mappings based on Logitech G502 hardware inputs.
*   **Context-Driven Filtering:** A quick-select menu to filter and highlight hotkeys relative to active DAW contexts (Global, Playlist, Piano Roll, Mixer, Channel Rack, Browser).
*   **Active Modifier Indicators:** Clickable or keyboard-triggered Ctrl, Shift, and Alt HUD indicator toggles that dynamically update the visual labels rendered on the keys.
*   **The Learning Center:**
    *   *Endless Flashcards:* Finds random, context-based actions and prompts you to locate and click the correct key, featuring built-in voice-guided feedback and relative modifier warnings.
    *   *10-Question Quizzes:* Generates randomized multiple-choice tests to evaluate your FL Studio hotkey knowledge.
*   **Searchable Index:** A fully searchable list of FL Studio keyboard and mouse actions with hover-to-highlight keyboard routing.

### 3. The Songwriting Lab (SYS.TOPLINE)
A physical, drag-and-drop lyric composition board and top-line reference suite to bypass creative writer's block.

*   **Draggable Vocal Magnet Board:** An absolute-positioned, PointerEvent-driven canvas allowing you to grab, drag, and structure spawned word cards (compatible with mouse, trackpad, and touchscreen monitors).
*   **Symmetric Multi-Dragging:** Holding **Ctrl** (or **Cmd** on Mac) while clicking cards highlights them with a glowing, dashed border [1]. Releasing one of them moves, auto-deletes, or copies the entire selected group in perfect synchronization.
*   **Off-Board Auto-Delete:** Dragging any card off the visual boundaries of the canvas instantly removes it from the board and triggers an auto-save.
*   **Copy-on-Drop Drag Logic:** Dragging and dropping an active card directly onto your Saved Dictionary container copies the word to your persistent cache but preserves the card on your board, preventing your visual lines from breaking [1].
*   **🎲 Inspiration Dice Button:** Clicking the dice picks a random word from your 473-word offline database, injects it into your search input field, and instantly triggers a debounced Datamuse query based on your active dropdown parameters [1].
*   **Dynamic suggestions flexbox drawer:** Inputting a custom word automatically triggers a debounced background query to the Datamuse API, populating a static, scrollable 3-row drawer with up to 40 related words [1].
*   **The 3-Button Bulk Spawner:** Spawns the top 5, top 10, or top 20 suggested words onto your board in a single click [1].
*   **My Saved Vocabulary Bank:** A persistent, user-curated local storage bank. Includes hover-triggered close "✕" deletion badges to prevent click-overlap bugs, and a `.txt` file exporter [1].
*   **26 Dark-Mode Theme Presets:** Choose from 26 distinct styles (loaded dynamically via `themes.json`) to match your active DAW look [1].
*   **In-Window Custom Modals:** A Promise-based custom modal popup engine (`customAlert` and `customConfirm`) [1]. This bypasses system-level browser alerts, allowing you to confirm deletions and board clears entirely inside your DAW window [1].
*   **Theory Reference Desk:**
    *   *Universal Progressions Directory:* Standard transposable Roman numeral formulas.
    *   *Guitar Tunings Drawer:* Side-by-side transcribed tabs for both Standard and Dropped configurations (Drop C, D Standard, Drop D, E Standard).
    *   *Lyrical Pacing Guidelines:* Syllable stress templates (Trochaic, Iambic, Dactylic) to match rhythms over alternative drum loops.

---

## File Directory Map

Here is the exact layout of your repository on your disk:

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
├── hotkeys/              <-- SYS.TACTILE (Hotkey Trainer Folder) [1]
│   ├── index.html        
│   ├── style.css         
│   ├── app.js            
│   ├── config.js         
│   └── data.js           
│   
└── canvas/               <-- SYS.TOPLINE (The Lab Folder) [1]
    ├── index.html        
    ├── style.css         
    ├── themes.css        
    ├── app.js            
    ├── drag.js           
    ├── placement.js      
    ├── reference.js      
    ├── storage.js        
    └── data/             <-- Dynamic JSON directories
        ├── themes.json   <-- Theme select directory [1]
        ├── chords/       <-- 12 Chromatic guitar key transcriptions
        ├── progressions/ <-- Progression paths JSON files
        └── word_pools/   <-- Offline static word dictionaries [1]