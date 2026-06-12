/**
 * THE LAB // worksheet.js
 * Modular Songwriting Map Worksheet Component
 * Injects worksheet markup and handles sheet-specific UI logic.
 */

const Worksheet = {
    init() {
        this.injectStyles();
        this.render();
        this.bindEvents();
    },

    render() {
        const modalHTML = `
        <div id="worksheet-modal" class="modal-overlay" style="display: none;">
            <div class="modal-card">
                <div class="modal-title" style="border-bottom: 1px solid var(--border-color); padding-bottom: 10px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;">
                    <span>📋 Songwriting Map Worksheet</span>
                    <div style="display: flex; gap: 8px; align-items: center;">
                        <div id="ws-controls-main" style="display: flex; gap: 8px;">
                            <button id="copy-sheet-txt-btn" class="canvas-btn" style="font-size: 10px; padding: 4px 8px; color: var(--neon-green); border-color: var(--neon-green);" title="Copy ASCII roadmap to clipboard">Copy Text</button>
                            <button id="export-sheet-txt-btn" class="canvas-btn" style="font-size: 10px; padding: 4px 8px; color: var(--neon-green); border-color: var(--neon-green);" title="Download roadmap as a text file">Export TXT</button>
                            <button id="print-sheet-pdf-btn" class="canvas-btn" style="font-size: 10px; padding: 4px 8px; color: var(--neon-cyan); border-color: var(--neon-cyan);" title="Print sheet or save to PDF">Print/Export PDF</button>
                            <button id="reset-worksheet-btn" class="canvas-btn" style="font-size: 10px; padding: 4px 8px; color: var(--theme-color-3); border-color: var(--theme-color-3);" title="Clear all answers on this sheet">Reset Sheet</button>
                            <button id="close-worksheet-btn" class="canvas-btn" style="font-size: 10px; padding: 4px 8px; color: var(--neon-orange); border-color: var(--neon-orange);" title="Close worksheet panel">Close</button>
                        </div>
                        <div id="ws-controls-confirm" style="display: none; gap: 8px; align-items: center;">
                            <span style="color: var(--neon-orange); font-size: 10px; font-weight: bold; text-transform: uppercase;">Clear all answers?</span>
                            <button id="ws-reset-yes" class="canvas-btn" style="font-size: 10px; padding: 4px 8px; color: var(--neon-green); border-color: var(--neon-green);" title="Confirm clearing data">Confirm</button>
                            <button id="ws-reset-no" class="canvas-btn" style="font-size: 10px; padding: 4px 8px; color: var(--text-secondary); border-color: var(--text-secondary);" title="Cancel reset">Cancel</button>
                        </div>
                    </div>
                </div>

                <div class="details-wrapper" style="text-align: left;">
                    <div class="callout" style="border-left-color: var(--theme-color-1); background-color: rgba(255, 215, 0, 0.01); margin-bottom: 15px;">
                        <div class="callout-title">Interactive Studio Map</div>
                        Answers to these questions are saved directly inside your active song draft JSON data, ensuring total consistency across backups.
                    </div>

                    <div class="ws-section">
                        <h3 class="ws-section-header">1. THE FOUNDATION (The Problem & The World)</h3>
                        <div style="display: flex; flex-direction: column; gap: 12px;">
                            <div>
                                <label class="highlight-cyan" style="font-size: 12px; font-weight: bold; display: block; margin-bottom: 4px;">1.1 What is the core problem, tension, or conflict driving this song?</label>
                                <textarea id="ws-q1" class="canvas-input" style="height: 60px;"></textarea>
                                <div id="ws-q1-mirror" class="print-mirror"></div>
                            </div>
                            <div>
                                <label class="highlight-cyan" style="font-size: 12px; font-weight: bold; display: block; margin-bottom: 4px;">1.2 When and where does the "Song World" exist? (Describe the imagery/atmosphere):</label>
                                <textarea id="ws-q2" class="canvas-input" style="height: 60px;"></textarea>
                                <div id="ws-q2-mirror" class="print-mirror"></div>
                            </div>
                            <div>
                                <label class="highlight-cyan" style="font-size: 12px; font-weight: bold; display: block; margin-bottom: 4px;">1.3 The Perspective: Who is singing, and to whom are they speaking?</label>
                                <textarea id="ws-q3" class="canvas-input" style="height: 60px;"></textarea>
                                <div id="ws-q3-mirror" class="print-mirror"></div>
                            </div>
                            <div>
                                <label class="highlight-cyan" style="font-size: 12px; font-weight: bold; display: block; margin-bottom: 4px;">1.4 The Setup: How do these details lead the listener toward the SONG TITLE?</label>
                                <textarea id="ws-q4" class="canvas-input" style="height: 60px;"></textarea>
                                <div id="ws-q4-mirror" class="print-mirror"></div>
                            </div>
                        </div>
                    </div>

                    <div class="ws-section" style="margin-top: 25px;">
                        <h3 class="ws-section-header">2. THE BUILD (Escalation & Consequences)</h3>
                        <div style="display: flex; flex-direction: column; gap: 12px;">
                            <div>
                                <label class="highlight-cyan" style="font-size: 12px; font-weight: bold; display: block; margin-bottom: 4px;">2.1 How does the problem or tension escalate in this section?</label>
                                <textarea id="ws-q5" class="canvas-input" style="height: 60px;"></textarea>
                                <div id="ws-q5-mirror" class="print-mirror"></div>
                            </div>
                            <div>
                                <label class="highlight-cyan" style="font-size: 12px; font-weight: bold; display: block; margin-bottom: 4px;">2.2 What is the immediate consequence of the initial problem?</label>
                                <textarea id="ws-q6" class="canvas-input" style="height: 60px;"></textarea>
                                <div id="ws-q6-mirror" class="print-mirror"></div>
                            </div>
                            <div>
                                <label class="highlight-cyan" style="font-size: 12px; font-weight: bold; display: block; margin-bottom: 4px;">2.3 The Sensory Shift: How else is the problem felt, heard, or seen now?</label>
                                <textarea id="ws-q7" class="canvas-input" style="height: 60px;"></textarea>
                                <div id="ws-q7-mirror" class="print-mirror"></div>
                            </div>
                            <div>
                                <label class="highlight-cyan" style="font-size: 12px; font-weight: bold; display: block; margin-bottom: 4px;">2.4 Narrative Progression: What happens next in the story?</label>
                                <textarea id="ws-q8" class="canvas-input" style="height: 60px;"></textarea>
                                <div id="ws-q8-mirror" class="print-mirror"></div>
                            </div>
                            <div>
                                <label class="highlight-cyan" style="font-size: 12px; font-weight: bold; display: block; margin-bottom: 4px;">2.5 Title Re-framing: How does this section set up the TITLE from a different angle?</label>
                                <textarea id="ws-q9" class="canvas-input" style="height: 60px;"></textarea>
                                <div id="ws-q9-mirror" class="print-mirror"></div>
                            </div>
                        </div>
                    </div>

                    <div class="ws-section" style="margin-top: 25px;">
                        <h3 class="ws-section-header">3. THE RESOLUTION (Final Escalation & Future)</h3>
                        <div style="display: flex; flex-direction: column; gap: 12px;">
                            <div>
                                <label class="highlight-cyan" style="font-size: 12px; font-weight: bold; display: block; margin-bottom: 4px;">3.1 What is the final escalation or "breaking point" of the conflict?</label>
                                <textarea id="ws-q10" class="canvas-input" style="height: 60px;"></textarea>
                                <div id="ws-q10-mirror" class="print-mirror"></div>
                            </div>
                            <div>
                                <label class="highlight-cyan" style="font-size: 12px; font-weight: bold; display: block; margin-bottom: 4px;">3.2 The Pivot: What is a completely different way to think about this situation?</label>
                                <textarea id="ws-q11" class="canvas-input" style="height: 60px;"></textarea>
                                <div id="ws-q11-mirror" class="print-mirror"></div>
                            </div>
                            <div>
                                <label class="highlight-cyan" style="font-size: 12px; font-weight: bold; display: block; margin-bottom: 4px;">3.3 The Ideal: How would you prefer the situation to be instead?</label>
                                <textarea id="ws-q12" class="canvas-input" style="height: 60px;"></textarea>
                                <div id="ws-q12-mirror" class="print-mirror"></div>
                            </div>
                            <div>
                                <label class="highlight-cyan" style="font-size: 12px; font-weight: bold; display: block; margin-bottom: 4px;">3.4 Time Jump: What will this look like one year from now?</label>
                                <textarea id="ws-q13" class="canvas-input" style="height: 60px;"></textarea>
                                <div id="ws-q13-mirror" class="print-mirror"></div>
                            </div>
                            <div>
                                <label class="highlight-cyan" style="font-size: 12px; font-weight: bold; display: block; margin-bottom: 4px;">3.5 The Present Moment: what is happening right now? How has it changed?</label>
                                <textarea id="ws-q14" class="canvas-input" style="height: 60px;"></textarea>
                                <div id="ws-q14-mirror" class="print-mirror"></div>
                            </div>
                            <div>
                                <label class="highlight-cyan" style="font-size: 12px; font-weight: bold; display: block; margin-bottom: 4px;">3.6 The Final Payoff: How does this set up the TITLE in a way that feels different?</label>
                                <textarea id="ws-q15" class="canvas-input" style="height: 60px;"></textarea>
                                <div id="ws-q15-mirror" class="print-mirror"></div>
                            </div>
                        </div>
                    </div>

                    <div class="ws-section" style="margin-top: 25px;">
                        <h3 class="ws-section-header">4. SONG SUMMARY / NOTES</h3>
                        <div style="display: flex; flex-direction: column; gap: 12px;">
                            <div>
                                <label class="highlight-cyan" style="font-size: 12px; font-weight: bold; display: block; margin-bottom: 4px;">Melodic Ideas:</label>
                                <textarea id="ws-notes-melodic" class="canvas-input" style="height: 50px;"></textarea>
                                <div id="ws-notes-melodic-mirror" class="print-mirror"></div>
                            </div>
                            <div>
                                <label class="highlight-cyan" style="font-size: 12px; font-weight: bold; display: block; margin-bottom: 4px;">Key Imagery Words:</label>
                                <textarea id="ws-notes-imagery" class="canvas-input" style="height: 50px;"></textarea>
                                <div id="ws-notes-imagery-mirror" class="print-mirror"></div>
                            </div>
                            <div>
                                <label class="highlight-cyan" style="font-size: 12px; font-weight: bold; display: block; margin-bottom: 4px;">Final Lyrical Hook:</label>
                                <textarea id="ws-notes-hook" class="canvas-input" style="height: 50px;"></textarea>
                                <div id="ws-notes-hook-mirror" class="print-mirror"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    },

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #worksheet-modal textarea {
                width: 100%;
                box-sizing: border-box;
                background-color: #05050a;
                border: 1px solid var(--border-color);
                border-radius: 4px;
                padding: 8px;
                color: var(--text-primary);
                font-family: var(--font-mono);
                font-size: 12px;
                outline: none;
                resize: none;
            }
            .print-mirror {
                display: none; /* Hidden on screen, shown via @media print in style.css */
                white-space: pre-wrap;
            }
            #worksheet-modal textarea:focus {
                border-color: var(--theme-color-1);
            }
            .ws-section-header {
                font-size: 14px;
                color: var(--theme-color-1);
                border-bottom: 1px solid var(--border-color);
                padding-bottom: 5px;
                margin-bottom: 15px;
            }
        `;
        document.head.appendChild(style);
    },

    bindEvents() {
        const modal = document.getElementById('worksheet-modal');
        const closeBtn = document.getElementById('close-worksheet-btn');
        const copyBtn = document.getElementById('copy-sheet-txt-btn');
        const exportBtn = document.getElementById('export-sheet-txt-btn');
        const printBtn = document.getElementById('print-sheet-pdf-btn');
        const resetBtn = document.getElementById('reset-worksheet-btn');
        const resetYesBtn = document.getElementById('ws-reset-yes');
        const resetNoBtn = document.getElementById('ws-reset-no');
        const controlsMain = document.getElementById('ws-controls-main');
        const controlsConfirm = document.getElementById('ws-controls-confirm');
        const textareas = modal.querySelectorAll('textarea');

        closeBtn?.addEventListener('click', () => modal.style.display = 'none');

        resetBtn?.addEventListener('click', () => {
            if (controlsMain && controlsConfirm) {
                controlsMain.style.display = 'none';
                controlsConfirm.style.display = 'flex';
            }
        });

        resetNoBtn?.addEventListener('click', () => {
            if (controlsMain && controlsConfirm) {
                controlsMain.style.display = 'flex';
                controlsConfirm.style.display = 'none';
            }
        });

        resetYesBtn?.addEventListener('click', () => {
            textareas.forEach(ta => ta.value = "");
            if (typeof StorageEngine !== 'undefined') {
                StorageEngine.saveActiveDraft(true);
            }
            if (controlsMain && controlsConfirm) {
                controlsMain.style.display = 'flex';
                controlsConfirm.style.display = 'none';
            }
        });

        copyBtn?.addEventListener('click', () => {
            if (typeof StorageEngine !== 'undefined') StorageEngine.copyWorksheetToClipboard();
        });

        exportBtn?.addEventListener('click', () => {
            if (typeof StorageEngine !== 'undefined') StorageEngine.exportWorksheetAsTXT();
        });

        printBtn?.addEventListener('click', () => window.print());

        textareas.forEach(ta => {
            ta.addEventListener('input', () => {
                const mirror = document.getElementById(`${ta.id}-mirror`);
                if (mirror) mirror.textContent = ta.value;
                
                if (typeof StorageEngine !== 'undefined') {
                    StorageEngine.saveActiveDraft(true);
                }
            });
        });
    }
};

// Initialize the component immediately upon script load
Worksheet.init();