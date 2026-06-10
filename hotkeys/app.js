let mods = { ctrl: false, shift: false, alt: false };
let currentContext = "Master";
let searchQuery = "";

const KEY_LAYOUT = [
    { id: "ESC", x: 60, y: 10, w: 35 }, { id: "F1", x: 115, y: 10, w: 35 }, { id: "F2", x: 155, y: 10, w: 35 }, { id: "F3", x: 195, y: 10, w: 35 }, { id: "F4", x: 235, y: 10, w: 35 }, { id: "F5", x: 290, y: 10, w: 35 }, { id: "F6", x: 330, y: 10, w: 35 }, { id: "F7", x: 370, y: 10, w: 35 }, { id: "F8", x: 410, y: 10, w: 35 }, { id: "F9", x: 465, y: 10, w: 35 }, { id: "F10", x: 505, y: 10, w: 35 }, { id: "F11", x: 545, y: 10, w: 35 }, { id: "F12", x: 585, y: 10, w: 35 },
    { id: "~", x: 60, y: 60, w: 35 }, { id: "1", x: 100, y: 60, w: 35 }, { id: "2", x: 140, y: 60, w: 35 }, { id: "3", x: 180, y: 60, w: 35 }, { id: "4", x: 220, y: 60, w: 35 }, { id: "5", x: 260, y: 60, w: 35 }, { id: "6", x: 300, y: 60, w: 35 }, { id: "7", x: 340, y: 60, w: 35 }, { id: "8", x: 380, y: 60, w: 35 }, { id: "9", x: 420, y: 60, w: 35 }, { id: "0", x: 460, y: 60, w: 35 }, { id: "-", x: 500, y: 60, w: 35 }, { id: "=", x: 540, y: 60, w: 35 }, { id: "BACK", x: 580, y: 60, w: 75 },
    { id: "TAB", x: 60, y: 100, w: 55 }, { id: "Q", x: 120, y: 100, w: 35 }, { id: "W", x: 160, y: 100, w: 35 }, { id: "E", x: 200, y: 100, w: 35 }, { id: "R", x: 240, y: 100, w: 35 }, { id: "T", x: 280, y: 100, w: 35 }, { id: "Y", x: 320, y: 100, w: 35 }, { id: "U", x: 360, y: 100, w: 35 }, { id: "I", x: 400, y: 100, w: 35 }, { id: "O", x: 440, y: 100, w: 35 }, { id: "P", x: 480, y: 100, w: 35 }, { id: "[", x: 520, y: 100, w: 35 }, { id: "]", x: 560, y: 100, w: 35 }, { id: "\\", x: 600, y: 100, w: 55 },
    { id: "CAPS", x: 60, y: 140, w: 65 }, { id: "A", x: 130, y: 140, w: 35 }, { id: "S", x: 170, y: 140, w: 35 }, { id: "D", x: 210, y: 140, w: 35 }, { id: "F", x: 250, y: 140, w: 35 }, { id: "G", x: 290, y: 140, w: 35 }, { id: "H", x: 330, y: 140, w: 35 }, { id: "J", x: 370, y: 140, w: 35 }, { id: "K", x: 410, y: 140, w: 35 }, { id: "L", x: 450, y: 140, w: 35 }, { id: ";", x: 490, y: 140, w: 35 }, { id: "'", x: 530, y: 140, w: 35 }, { id: "ENTER", x: 570, y: 140, w: 85 },
    { id: "SHIFT_L", x: 60, y: 180, w: 85 }, { id: "Z", x: 150, y: 180, w: 35 }, { id: "X", x: 190, y: 180, w: 35 }, { id: "C", x: 230, y: 180, w: 35 }, { id: "V", x: 270, y: 180, w: 35 }, { id: "B", x: 310, y: 180, w: 35 }, { id: "N", x: 350, y: 180, w: 35 }, { id: "M", x: 390, y: 180, w: 35 }, { id: ",", x: 430, y: 180, w: 35 }, { id: ".", x: 470, y: 180, w: 35 }, { id: "/", x: 510, y: 180, w: 35 }, { id: "SHIFT_R", x: 550, y: 180, w: 105 },
    { id: "CTRL_L", x: 60, y: 220, w: 45 }, { id: "WIN_L", x: 110, y: 220, w: 45 }, { id: "ALT_L", x: 160, y: 220, w: 45 }, { id: "SPACE", x: 210, y: 220, w: 235 }, { id: "ALT_R", x: 450, y: 220, w: 45 }, { id: "WIN_R", x: 500, y: 220, w: 45 }, { id: "MENU", x: 550, y: 220, w: 45 }, { id: "CTRL_R", x: 600, y: 220, w: 55 },
    { id: "INS", x: 675, y: 60, w: 35 }, { id: "HOME", x: 715, y: 60, w: 35 }, { id: "PGUP", x: 755, y: 60, w: 35 }, { id: "DEL", x: 675, y: 100, w: 35 }, { id: "END", x: 715, y: 100, w: 35 }, { id: "PGDN", x: 755, y: 100, w: 35 },
    { id: "UP", x: 715, y: 180, w: 35 }, { id: "LEFT", x: 675, y: 220, w: 35 }, { id: "DOWN", x: 715, y: 220, w: 35 }, { id: "RIGHT", x: 755, y: 220, w: 35 },
    { id: "NUM_LCK", x: 810, y: 60, w: 35 }, { id: "NUM_/", x: 850, y: 60, w: 35 }, { id: "NUM_*", x: 890, y: 60, w: 35 }, { id: "NUM_-", x: 930, y: 60, w: 35 },
    { id: "NUM_7", x: 810, y: 100, w: 35 }, { id: "NUM_8", x: 850, y: 100, w: 35 }, { id: "NUM_9", x: 890, y: 100, w: 35 }, { id: "NUM_+", x: 930, y: 100, w: 35, h: 75 },
    { id: "NUM_4", x: 810, y: 140, w: 35 }, { id: "NUM_5", x: 850, y: 140, w: 35 }, { id: "NUM_6", x: 890, y: 140, w: 35 },
    { id: "NUM_1", x: 810, y: 180, w: 35 }, { id: "NUM_2", x: 850, y: 180, w: 35 }, { id: "NUM_3", x: 890, y: 180, w: 35 }, { id: "NUM_ENT", x: 930, y: 180, w: 35, h: 75 },
    { id: "NUM_0", x: 810, y: 220, w: 75 }, { id: "NUM_.", x: 890, y: 220, w: 35 },
    { id: "G1", x: 10, y: 60, w: 35 }, { id: "G2", x: 10, y: 100, w: 35 }, { id: "G3", x: 10, y: 140, w: 35 }, { id: "G4", x: 10, y: 180, w: 35 }, { id: "G5", x: 10, y: 220, w: 35 },
    { id: "G6", x: 145, y: -30, w: 30 }, { id: "G7", x: 180, y: -30, w: 30 }, { id: "G8", x: 215, y: -30, w: 30 }, { id: "G9", x: 250, y: -30, w: 30 } 
    // adjust padding between G-keys and main keyboard by modifying the x value of G6-G9
];

function init() {
    renderKeyboard();
    renderMouseDrawer();
    setupListeners();
    updateContextList(); 
    updateEngine();
    LearningEngine.init();
}

function renderKeyboard() {
    const svg = document.getElementById('g910-svg');
    const scale = 1.55; // This "beefs up" the keyboard size globally
    
    KEY_LAYOUT.forEach(k => {
        // Calculate new beefy dimensions
        const width = k.w * scale;
        const height = (k.h || 35) * scale;
        const posX = k.x * scale;
        const posY = k.y * scale;

        const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        group.setAttribute("class", "key"); 
        group.setAttribute("id", `key-${k.id}`);
        
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", posX); 
        rect.setAttribute("y", posY);
        rect.setAttribute("width", width); 
        rect.setAttribute("height", height);

        // Main Text (centered in the beefy key)
        const txtMain = document.createElementNS("http://www.w3.org/2000/svg", "text");
        txtMain.setAttribute("x", posX + width / 2); 
        txtMain.setAttribute("y", posY + height / 2 + 4);
        txtMain.setAttribute("class", "key-text-main");
        txtMain.textContent = formatKeyName(k.id);

        // Sub Text (for hotkey labels)
        const txtSub = document.createElementNS("http://www.w3.org/2000/svg", "text");
        txtSub.setAttribute("x", posX + width / 2); 
        txtSub.setAttribute("y", posY + height - 8); // Adjusted padding for larger key
        txtSub.setAttribute("class", "key-text-sub");

        group.appendChild(rect); 
        group.appendChild(txtMain); 
        group.appendChild(txtSub);
        svg.appendChild(group);
        group.onclick = () => {
            // 1. Check if the clicked key is a modifier
            const modMap = {
                'CTRL_L': 'ctrl', 'CTRL_R': 'ctrl',
                'SHIFT_L': 'shift', 'SHIFT_R': 'shift',
                'ALT_L': 'alt', 'ALT_R': 'alt'
            };

            if (modMap[k.id]) {
                const targetMod = modMap[k.id];
                // Toggle the state
                mods[targetMod] = !mods[targetMod];
                
                // Sync the header buttons visually
                const headerBtn = document.getElementById(`mod-${targetMod}`);
                if (mods[targetMod]) headerBtn.classList.add(`on-${targetMod}`);
                else headerBtn.classList.remove(`on-${targetMod}`);
                
                // Update the keyboard labels
                updateEngine();
            } else {
                // 2. If it's NOT a modifier, proceed to Learning Engine check
                if (LearningEngine.active) {
                    LearningEngine.checkFlash(k.id);
                }
            }
        };
        group.onmouseenter = (e) => showInfo(e, k.id, 'kb');
        group.onmouseleave = hideTooltip;
    });
}

function cleanText(text) { return text.replace(/ tool/gi, '').substring(0, 10) + (text.length > 10 ? "." : ""); }
function getActiveModStr() {
    let arr = [];
    if (mods.ctrl) arr.push("Ctrl"); if (mods.alt) arr.push("Alt"); if (mods.shift) arr.push("Shift");
    return arr.join("+");
}


// -----------------------------
// ENGINES: KEYBOARD, MOUSE & LIST
// -----------------------------
function updateEngine() {
    const modStr = getActiveModStr();
    
    // 1. Define Standard Context Priority
    let contextPriority = ["Playlist", "Piano Roll", "Mixer", "Channel Rack", "Browser", "Global"];

    // 2. DYNAMIC HIJACK: If a flashcard is active, prioritize its context above all else
    if (LearningEngine.active && LearningEngine.mode === 'flash' && LearningEngine.currentQuestion) {
        const activeCtx = LearningEngine.currentQuestion.context;
        // Move current question context to the front of the priority list
        contextPriority = [activeCtx, ...contextPriority.filter(c => c !== activeCtx)];
    }

    // 3. RESET PASS: Clear all visual states
    document.querySelectorAll('.key').forEach(group => {
        group.classList.remove("has-action", "macro", "combo-highlight");
        const subTxt = group.querySelector('.key-text-sub');
        if (subTxt) subTxt.textContent = "";
    });

    // 4. SVG KEYBOARD POPULATION
    KEY_LAYOUT.forEach(k => {
        const group = document.getElementById(`key-${k.id}`);
        if (!group) return;
        const subTxt = group.querySelector('.key-text-sub');

        if (CONFIG.g_keys[k.id]) {
            group.classList.add("macro"); 
            subTxt.textContent = "MACRO"; 
            return;
        }

        let match = null;

        // If in Master mode OR a Flashcard is active, use the Priority List
        if (currentContext === "Master" || LearningEngine.active) {
            const potentials = FL_DATA.shortcuts.filter(s => s.key === k.id && s.mod === modStr);
            potentials.sort((a, b) => {
                let indexA = contextPriority.indexOf(a.context);
                let indexB = contextPriority.indexOf(b.context);
                if (indexA === -1) indexA = 99;
                if (indexB === -1) indexB = 99;
                return indexA - indexB;
            });
            if (potentials.length > 0) match = potentials[0];
        } else {
            // Specific Context View logic
            match = FL_DATA.shortcuts.find(s => s.key === k.id && s.mod === modStr && s.context === currentContext);
            if (!match) match = FL_DATA.shortcuts.find(s => s.key === k.id && s.mod === modStr && s.context === "Global");
        }

        if (match) {
            group.classList.add("has-action"); 
            subTxt.textContent = cleanText(match.action);
        }
    });

    // 5. MODIFIER KEY VISUAL SYNC
    const modStates = [
        { id: ['CTRL_L', 'CTRL_R'], state: mods.ctrl, class: 'active-ctrl' },
        { id: ['SHIFT_L', 'SHIFT_R'], state: mods.shift, class: 'active-shift' },
        { id: ['ALT_L', 'ALT_R'], state: mods.alt, class: 'active-alt' }
    ];
    modStates.forEach(m => {
        m.id.forEach(keyId => {
            const el = document.getElementById(`key-${keyId}`);
            if (el && m.state) el.classList.add('active-mod', m.class);
            else if (el) el.classList.remove('active-mod', 'active-ctrl', 'active-shift', 'active-alt');
        });
    });

    // 6. MOUSE MATRIX POPULATION (Respects same priority)
    const mmDefs = { 'mm-left': 'Standard Click', 'mm-right': 'Context / Tool', 'mm-mid': 'Pan', 'mm-wheel': 'Scroll' };
    Object.keys(mmDefs).forEach(id => {
        const el = document.getElementById(id);
        el.classList.remove('has-action', 'combo-highlight');
        el.removeAttribute('data-context');
        el.querySelector('.mm-text').textContent = mmDefs[id];
    });

    FL_DATA.shortcuts.forEach(s => {
        const isRelevant = currentContext === "Master" || s.context === currentContext || s.context === "Global" || LearningEngine.active;
        if (s.type === 'mouse' && s.mod === modStr && isRelevant) {
            let tId = null;
            if (s.key.includes('Left-Click')) tId = 'mm-left';
            if (s.key.includes('Right-Click')) tId = 'mm-right';
            if (s.key.includes('Middle-Click')) tId = 'mm-mid';
            if (s.key.includes('wheel')) tId = 'mm-wheel';

            if (tId) {
                const el = document.getElementById(tId);
                const existingAction = el.getAttribute('data-context');
                const newPriority = contextPriority.indexOf(s.context);
                const oldPriority = contextPriority.indexOf(existingAction);

                if (!existingAction || (newPriority !== -1 && newPriority < oldPriority) || oldPriority === -1) {
                    el.classList.add('has-action');
                    el.setAttribute('data-context', s.context);
                    el.querySelector('.mm-text').textContent = s.action.substring(0, 20);
                    el.onmouseenter = (e) => showInfo(e, s.key, 'mouse', s);
                    el.onmouseleave = hideTooltip;
                }
            }
        }
    });
}

function updateContextList() {
    const listDiv = document.getElementById('reference-list');
    listDiv.innerHTML = '';

    let filtered = FL_DATA.shortcuts.filter(s => {
        const cMatch = currentContext === "Master" || s.context === currentContext || s.context === "Global";
        const sMatch = s.action.toLowerCase().includes(searchQuery) || s.key.toLowerCase().includes(searchQuery);
        return cMatch && sMatch;
    });

    const groups = {};
    filtered.forEach(s => {
        const gName = currentContext === "Master" ? "Master List" : (s.type === "mouse" ? "Mouse/Hybrid Actions" : "Keyboard Actions");
        if (!groups[gName]) groups[gName] = [];
        groups[gName].push(s);
    });

    for (const [groupName, items] of Object.entries(groups)) {
        const gDiv = document.createElement('div'); gDiv.className = 'ref-group';
        gDiv.innerHTML = `<div class="ref-group-title">${groupName}</div>`;
        items.forEach(item => {
            const row = document.createElement('div'); row.className = 'ref-item';
            let kbdStr = item.mod ? item.mod.split('+').map(m => `<kbd>${m}</kbd> + `).join('') : '';
            kbdStr += `<kbd>${item.key}</kbd>`;
            row.innerHTML = `<div class="ref-item-desc">${item.action}</div><div class="ref-item-keys">${kbdStr}</div>`;
            
            row.onmouseenter = () => highlightReverse(item.mod, item.key, item.type);
            row.onmouseleave = updateEngine;
            gDiv.appendChild(row);
        });
        listDiv.appendChild(gDiv);
    }
}

// -----------------------------
// REVERSE-LOOKUP & HOVER INFO
// -----------------------------
function highlightReverse(modString, keyString, type) {
    document.querySelectorAll('.key').forEach(k => k.setAttribute('class', 'key'));
    document.querySelectorAll('.matrix-btn').forEach(m => m.classList.remove('combo-highlight'));

    if(type === 'mouse') {
        let tId = null;
        if (keyString.includes('Left-Click')) tId = 'mm-left';
        if (keyString.includes('Right-Click')) tId = 'mm-right';
        if (keyString.includes('Middle-Click')) tId = 'mm-mid';
        if (keyString.includes('wheel')) tId = 'mm-wheel';
        if (tId) document.getElementById(tId).classList.add('combo-highlight');
    } else {
        let targets = [];
        if(modString.includes('Ctrl')) targets.push('CTRL_L', 'CTRL_R');
        if(modString.includes('Shift')) targets.push('SHIFT_L', 'SHIFT_R');
        if(modString.includes('Alt')) targets.push('ALT_L', 'ALT_R');
        let kId = keyString.toUpperCase();
        if(kId === 'SPACEBAR' || kId === 'SPACE') kId = 'SPACE';
        targets.push(kId);
        targets.forEach(tId => { let el = document.getElementById(`key-${tId}`); if(el) el.classList.add('combo-highlight'); });
    }
}

function showInfo(event, id, type, preMatched = null) {
    let displayId = (type === 'kb') ? formatKeyName(id) : id;
    
    // 1. UPDATED: Removed brackets from initial title assignment
    let title = displayId; 
    let action = "No shortcut assigned.";
    let details = "";

    const contextPriority = ["Playlist", "Piano Roll", "Mixer", "Channel Rack", "Browser", "Global"];

    if (LearningEngine.active && LearningEngine.mode === 'flash' && LearningEngine.currentQuestion) {
        const activeCtx = LearningEngine.currentQuestion.context;
        contextPriority.unshift(...contextPriority.splice(contextPriority.indexOf(activeCtx), 1));
    }

    if (CONFIG.g_keys[id]) { 
        // 2. UPDATED: Removed brackets from Macro title assignment
        title = `MACRO: ${displayId}`; 
        action = `${CONFIG.g_keys[id].label} (Sends: ${CONFIG.g_keys[id].cmd})`; 
    } else {
        let currentMod = getActiveModStr();
        let match = preMatched;

        if (!match) {
            const potentials = FL_DATA.shortcuts.filter(s => s.key === id && s.mod === currentMod);
            if (currentContext === "Master" || LearningEngine.active) {
                potentials.sort((a, b) => {
                    let indexA = contextPriority.indexOf(a.context);
                    let indexB = contextPriority.indexOf(b.context);
                    return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
                });
                if (potentials.length > 0) match = potentials[0];
            } else {
                match = potentials.find(s => s.context === currentContext) || potentials.find(s => s.context === "Global");
            }
        }

        if (match) {
            action = match.action;
            details = match.details || "";
            title += ` <span style="color:#ee2400; font-size:12px; margin-left:12px; letter-spacing:1px; font-weight:bold; opacity:0.8;">— ${match.context.toUpperCase()}</span>`;
        }
    }
    
    document.getElementById('hud-title').innerHTML = title; 
    document.getElementById('hud-desc').textContent = action;
    document.getElementById('hud-details').textContent = details;
    
    document.getElementById('tt-title').innerHTML = title; 
    document.getElementById('tt-desc').textContent = action;
    document.getElementById('tooltip').classList.remove('hidden');
}

function hideTooltip() {
    document.getElementById('tooltip').classList.add('hidden');
    document.getElementById('hud-title').textContent = "[ STANDBY ]";
    document.getElementById('hud-desc').textContent = "Hover over keys, list items, or click CTRL/ALT/SHIFT above.";
    document.getElementById('hud-details').textContent = "";
}

// -----------------------------
// LISTENERS & MISC
// -----------------------------
function setupListeners() {
    const drawer = document.getElementById('mouse-drawer');
    document.getElementById('toggle-mouse').onclick = () => drawer.classList.add('open');
    document.getElementById('close-mouse').onclick = () => drawer.classList.remove('open');

    document.getElementById('search-input').addEventListener('keyup', (e) => {
        searchQuery = e.target.value.toLowerCase(); updateContextList();
    });
    document.getElementById('context-select').onchange = (e) => {
        currentContext = e.target.value; document.getElementById('mode-badge').innerText = currentContext;
        updateEngine(); updateContextList();
    };

    ['ctrl', 'shift', 'alt'].forEach(mod => {
        document.getElementById(`mod-${mod}`).onclick = (e) => {
            mods[mod] = !mods[mod];
            if(mods[mod]) e.target.classList.add(`on-${mod}`); else e.target.classList.remove(`on-${mod}`);
            updateEngine();
        };
    });

    window.onkeydown = (e) => {
        if(e.target.tagName === 'INPUT') return; 

        // 1. Sync Modifiers and Update HUD Labels
        if (e.key === "Control") { mods.ctrl = true; document.getElementById('mod-ctrl').classList.add('on-ctrl'); updateEngine(); }
        if (e.key === "Shift") { mods.shift = true; document.getElementById('mod-shift').classList.add('on-shift'); updateEngine(); }
        if (e.key === "Alt") { 
            e.preventDefault(); 
            e.stopPropagation(); // Aggressive stop to prevent browser menu
            mods.alt = true; 
            document.getElementById('mod-alt').classList.add('on-alt'); 
            updateEngine(); 
        }

        // 2. Visual Feedback (Pressed State)
        // Note: Using e.code to map physical keys like 'ControlLeft' to SVG IDs like 'CTRL_L'
        let keyId = e.key.toUpperCase();
        if (e.code === "ControlLeft") keyId = "CTRL_L";
        if (e.code === "ControlRight") keyId = "CTRL_R";
        if (e.code === "ShiftLeft") keyId = "SHIFT_L";
        if (e.code === "ShiftRight") keyId = "SHIFT_R";
        if (e.code === "AltLeft") keyId = "ALT_L";
        if (e.code === "AltRight") keyId = "ALT_R";
        if (e.code === "Space") keyId = "SPACE";
        if (e.code === "Backspace") keyId = "BACK";

        const el = document.getElementById(`key-${keyId}`);
        if (el) el.classList.add('key-pressed');
    };

    window.onkeyup = (e) => {
        // 1. Sync Modifiers
        if (e.key === "Control") { mods.ctrl = false; document.getElementById('mod-ctrl').classList.remove('on-ctrl'); updateEngine(); }
        if (e.key === "Shift") { mods.shift = false; document.getElementById('mod-shift').classList.remove('on-shift'); updateEngine(); }
        if (e.key === "Alt") { mods.alt = false; document.getElementById('mod-alt').classList.remove('on-alt'); updateEngine(); }

        // 2. Clear Visual Feedback
        let keyId = e.key.toUpperCase();
        if (e.code === "ControlLeft") keyId = "CTRL_L";
        if (e.code === "ControlRight") keyId = "CTRL_R";
        if (e.code === "ShiftLeft") keyId = "SHIFT_L";
        if (e.code === "ShiftRight") keyId = "SHIFT_R";
        if (e.code === "AltLeft") keyId = "ALT_L";
        if (e.code === "AltRight") keyId = "ALT_R";
        if (e.code === "Space") keyId = "SPACE";
        if (e.code === "Backspace") keyId = "BACK";

        const el = document.getElementById(`key-${keyId}`);
        if (el) el.classList.remove('key-pressed');
    };

    document.addEventListener('mousemove', (e) => {
        const tt = document.getElementById('tooltip');
        if (!tt.classList.contains('hidden')) { tt.style.left = (e.clientX + 15) + 'px'; tt.style.top = (e.clientY + 15) + 'px'; }
    });
    document.getElementById('mm-left').onclick = () => LearningEngine.checkFlash('Left-Click');
    document.getElementById('mm-right').onclick = () => LearningEngine.checkFlash('Right-Click');
    document.getElementById('mm-mid').onclick = () => LearningEngine.checkFlash('Middle-Click');
    document.getElementById('mm-wheel').onclick = () => LearningEngine.checkFlash('Mouse-wheel');
}

// Fixes naming (e.g., "NUM_1" to "NUM 1", "ALT_R" to "ALT (R)")
function formatKeyName(id) {
    if (!id) return "";
    
    // 1. Handle Side Modifiers (SHIFT_L -> SHIFT (L))
    if (id.includes('_L')) return id.split('_')[0] + ' (L)';
    if (id.includes('_R')) return id.split('_')[0] + ' (R)';
    
    // 2. Handle Numpad formatting
    if (id.startsWith('NUM_')) {
        let n = id.replace('NUM_', '');
        if (n === 'ENT') return 'N ENT';
        if (n === 'LCK') return 'NUM LCK';
        if (n === '/') return 'NUM /';
        if (n === '*') return 'NUM *';
        if (n === '+') return 'NUM +';
        if (n === '.') return 'NUM .';
        return 'NUM ' + n;
    }
    
    // 3. Handle specific standard keys
    if (id === 'BACK') return 'BACKSPACE';
    
    return id; // Return original if no formatting needed
}


function getActiveModStr() {
    let arr = [];
    // Strict order: Ctrl, then Alt, then Shift to match data.js strings
    if (mods.ctrl) arr.push("Ctrl");
    if (mods.alt) arr.push("Alt");
    if (mods.shift) arr.push("Shift");
    return arr.join("+");
}


function renderMouseDrawer() {
    const list = document.getElementById('mouse-list');
    CONFIG.mouse_keys.forEach(m => {
        const div = document.createElement('div'); div.className = "mouse-item";
        div.innerHTML = `<div style="color:#888; font-size:11px;">${m.label}</div><div style="color:var(--logi-yellow); font-weight:bold;">${m.action}</div>`;
        list.appendChild(div);
    });
}

// ==========================================
// LEARNING ENGINE LOGIC
// ==========================================
const LearningEngine = {
    active: false,
    mode: null, 
    currentQuestion: null,
    score: 0,
    total: 0,
    queue: [], // The "Deck" of cards

    speak(text) {
        const msg = new SpeechSynthesisUtterance(text);
        msg.rate = 1.3;
        msg.volume = 0.6;
        msg.pitch = text === "Correct" ? 1.2 : 0.8;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(msg);
    },

    init() {
        this.active = false;
        const zone = document.getElementById('learning-zone');
        zone.innerHTML = `
            <div class="lz-menu">
                <button class="lz-btn" onclick="LearningEngine.start('flash')">Flashcards (Endless)</button>
                <button class="lz-btn" onclick="LearningEngine.start('quiz')">10-Question Quiz</button>
            </div>
        `;
    },

    start(mode) {
        this.active = true;
        this.mode = mode;
        this.score = 0;
        this.total = 0;
        this.queue = []; // Reset queue
        this.next();
    },

    // Shuffles the deck when it runs out
    refreshQueue() {
        const pool = FL_DATA.shortcuts.filter(s => 
            (currentContext === "Master" || s.context === currentContext || s.context === "Global") &&
            s.details
        );
        // Shuffle logic (Fisher-Yates)
        this.queue = [...pool].sort(() => Math.random() - 0.5);
    },

    next() {
        if (this.queue.length === 0) {
            this.refreshQueue();
        }
        this.currentQuestion = this.queue.pop();
        
        // Refresh the keyboard labels to match the new question's context priority
        updateEngine(); 
        
        this.render();
    },

    render() {
        const zone = document.getElementById('learning-zone');
        if (this.mode === 'flash') {
            zone.innerHTML = `
                <div class="flash-prompt">FIND KEY FOR: <br><strong style="font-size:24px; color:var(--logi-yellow);">${this.currentQuestion.action}</strong></div>
                <div style="margin-top:15px; display:flex; gap:10px; justify-content:center;">
                    <button class="lz-btn" style="padding:5px 12px; font-size:11px; border-color:#555; color:#888;" onclick="LearningEngine.revealAnswer()">Show Answer</button>
                    <button class="lz-btn" style="padding:5px 12px; font-size:11px; border-color:#555; color:#888;" onclick="LearningEngine.init()">Exit Training</button>
                </div>
                <div style="margin-top:10px; font-size:11px; color:#444;">Cards left in deck: ${this.queue.length}</div>
            `;
        } else if (this.mode === 'quiz') {
            const options = this.generateOptions(this.currentQuestion);
            zone.innerHTML = `
                <div class="quiz-question" style="color:var(--logi-blue); font-weight:bold; margin-bottom:20px;">QUESTION: ${this.currentQuestion.details}</div>
                <div class="quiz-options">
                    ${options.map(opt => `<button class="option-btn" onclick="LearningEngine.checkQuiz('${opt.action.replace(/'/g, "\\'")}')">${opt.action}</button>`).join('')}
                </div>
            `;
        }
    },

    revealAnswer() {
        this.speak("Here is the answer");
        const searchInput = document.getElementById('search-input');
        searchInput.value = this.currentQuestion.action;
        searchQuery = this.currentQuestion.action.toLowerCase();
        updateContextList();
        
        // AUTO-TOGGLE MODIFIERS: Force the UI to show the correct combination
        if (this.currentQuestion.mod) {
            const targetMod = this.currentQuestion.mod;
            mods.ctrl = targetMod.includes("Ctrl");
            mods.shift = targetMod.includes("Shift");
            mods.alt = targetMod.includes("Alt");
            
            // Sync Header UI
            document.getElementById('mod-ctrl').classList.toggle('on-ctrl', mods.ctrl);
            document.getElementById('mod-shift').classList.toggle('on-shift', mods.shift);
            document.getElementById('mod-alt').classList.toggle('on-alt', mods.alt);
        } else {
            // Clear mods if none required
            mods.ctrl = false; mods.shift = false; mods.alt = false;
            document.getElementById('mod-ctrl').classList.remove('on-ctrl');
            document.getElementById('mod-shift').classList.remove('on-shift');
            document.getElementById('mod-alt').classList.remove('on-alt');
        }

        // Final UI Refresh to show the correct text on the key
        updateEngine();
        
        if (this.currentQuestion.mod) {
            this.triggerModHint(this.currentQuestion.mod);
        }
    },

    generateOptions(correct) {
        let options = [correct];
        const distractors = FL_DATA.shortcuts.filter(s => s.action !== correct.action);
        while (options.length < 4 && distractors.length > 0) {
            const rand = distractors[Math.floor(Math.random() * distractors.length)];
            if (!options.find(o => o.action === rand.action)) options.push(rand);
        }
        return options.sort(() => Math.random() - 0.5);
    },

checkFlash(keyId) {
        if (!this.active || this.mode !== 'flash') return;

        const currentModStr = getActiveModStr();
        const targetAction = this.currentQuestion.action;

        // 1. GLOBAL ACTION SEARCH (The "Win" Condition)
        // We look for ANY shortcut that matches the key/mod AND performs the target action.
        // We ignore the 'currentContext' here so the dropdown doesn't block your answer.
        const isCorrectInput = FL_DATA.shortcuts.some(s => {
            const cleanKey = s.key.replace("Double ", "").replace("Hold ", "");
            return cleanKey === keyId && s.mod === currentModStr && s.action === targetAction;
        });

        if (isCorrectInput) {
            this.speak("Correct");
            this.handleFeedback(keyId, true);
            document.getElementById('search-input').value = "";
            setTimeout(() => this.next(), 600);
            return; // Exit early on success
        }

        // 2. MODIFIER HINT CHECK (The "Close" Condition)
        // Check if the key is right for this action, but the modifiers are wrong.
        const modRequirementMatch = FL_DATA.shortcuts.find(s => {
            const cleanKey = s.key.replace("Double ", "").replace("Hold ", "");
            return cleanKey === keyId && s.action === targetAction;
        });

        if (modRequirementMatch) {
            // If they are already using the correct mod (or lack thereof), 
            // but didn't trigger the "Correct" check, it's a logic error fallback.
            if (modRequirementMatch.mod === currentModStr) {
                // This shouldn't happen with the new 'isCorrectInput' logic, 
                // but we add it as a safety 'Correct' trigger.
                this.speak("Correct");
                this.handleFeedback(keyId, true);
                setTimeout(() => this.next(), 600);
            } else {
                this.speak("Check your modifiers");
                this.triggerModHint(modRequirementMatch.mod);
                this.handleFeedback(keyId, false);
            }
        } 
        // 3. COMPLETELY WRONG
        else {
            this.speak("Incorrect");
            this.handleFeedback(keyId, false);
            // Optionally: Pulse the correct key as a hint if they are stuck
            // this.triggerKeyHint(this.currentQuestion.key); 
        }
    },

    triggerModHint(requiredModStr) {
        const modMap = {
            'Ctrl': { header: 'mod-ctrl', svg: ['key-CTRL_L', 'key-CTRL_R'] },
            'Alt': { header: 'mod-alt', svg: ['key-ALT_L', 'key-ALT_R'] },
            'Shift': { header: 'mod-shift', svg: ['key-SHIFT_L', 'key-SHIFT_R'] }
        };

        // If the shortcut requires NO modifiers, but the user had some active:
        if (!requiredModStr || requiredModStr === "") {
            this.speak("Try again with no modifiers active.");
            // Flash all active modifiers to show they should be turned OFF
            ['ctrl', 'alt', 'shift'].forEach(m => {
                if (mods[m]) {
                    const el = document.getElementById(`mod-${m}`);
                    el.classList.add('mod-pulse');
                    setTimeout(() => el.classList.remove('mod-pulse'), 1500);
                }
            });
            return;
        }

        const requiredArr = requiredModStr.split('+');
        requiredArr.forEach(modName => {
            const key = Object.keys(modMap).find(k => k.toLowerCase() === modName.toLowerCase());
            const targets = modMap[key];
            if (targets) {
                document.getElementById(targets.header)?.classList.add('mod-pulse');
                targets.svg.forEach(sId => document.getElementById(sId)?.classList.add('mod-pulse'));
                setTimeout(() => {
                    document.getElementById(targets.header)?.classList.remove('mod-pulse');
                    targets.svg.forEach(sId => document.getElementById(sId)?.classList.remove('mod-pulse'));
                }, 1500);
            }
        });
    },

    handleFeedback(id, success) {
        const keyEl = document.getElementById(`key-${id}`);
        let mouseId = null;
        if (id === 'Left-Click') mouseId = 'mm-left';
        if (id === 'Right-Click') mouseId = 'mm-right';
        if (id === 'Middle-Click') mouseId = 'mm-mid';
        if (id === 'Mouse-wheel') mouseId = 'mm-wheel';
        const mouseEl = mouseId ? document.getElementById(mouseId) : null;
        const target = keyEl || mouseEl;
        if (!target) return;
        const classStyle = success ? 'key-success' : 'key-fail';
        target.classList.add(classStyle);
        setTimeout(() => target.classList.remove(classStyle), 500);
    },

    checkQuiz(selectedAction) {
        if (selectedAction === this.currentQuestion.action) {
            this.score++;
            this.speak("Correct");
        } else {
            this.speak("Incorrect");
            alert(`Incorrect. \n\nThe shortcut for "${this.currentQuestion.action}" is: \n${this.currentQuestion.mod ? this.currentQuestion.mod + ' + ' : ''}${this.currentQuestion.key}`);
        }
        this.total++;
        if (this.total >= 10) this.finish();
        else this.next();
    },

    finish() {
        this.active = false;
        const zone = document.getElementById('learning-zone');
        zone.innerHTML = `
            <h2 style="color:var(--logi-yellow); margin:0;">QUIZ COMPLETE</h2>
            <div style="font-size:40px; margin:10px 0; color:#fff;">${this.score} / 10</div>
            <button class="lz-btn" onclick="LearningEngine.init()">Return to Menu</button>
        `;
        this.speak("Session Complete.");
    }
};

init();