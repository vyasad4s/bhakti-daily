const output = document.getElementById('output');
const input = document.getElementById('command-input');
const cursor = document.querySelector('.cursor');
const terminal = document.querySelector('.terminal');
const commandChipLine = document.querySelector('.command-chip-line');
const commandChips = document.querySelectorAll('.command-chip');

let commandHistory = [];
let historyIndex = -1;
let isAnimating = false;
const executableChipCommands = new Set(['help', 'about', 'verses', 'cosmic', 'archive', 'glossary', 'today', 'yesterday', 'chant']);
const activeAnimations = new Map();
let currentChantSession = null;

// Focus input on click anywhere
document.addEventListener('click', () => {
    if (!isAnimating) input.focus();
});

// Handle command input
input.addEventListener('keydown', async (e) => {
    if (isAnimating) {
        e.preventDefault();
        return;
    }
    
    if (e.key === 'Enter') {
        const command = input.value.trim();
        if (command) {
            await submitCommand(command);
        }
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex > 0) {
            historyIndex--;
            input.value = commandHistory[historyIndex];
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            input.value = commandHistory[historyIndex];
        } else {
            historyIndex = commandHistory.length;
            input.value = '';
        }
    }
});

commandChips.forEach((chip) => {
    let longPressTimer;
    let longPressUsed = false;
    const command = chip.dataset.command;

    chip.addEventListener('pointerdown', () => {
        longPressUsed = false;
        longPressTimer = window.setTimeout(() => {
            longPressUsed = true;
            fillCommand(command);
        }, 450);
    });

    chip.addEventListener('pointerup', async () => {
        window.clearTimeout(longPressTimer);
        if (longPressUsed || isAnimating) return;

        if (executableChipCommands.has(command)) {
            await submitCommand(command);
        } else {
            fillCommand(command);
        }
    });

    chip.addEventListener('pointerleave', () => {
        window.clearTimeout(longPressTimer);
    });
});

if (commandChipLine) {
    commandChipLine.addEventListener('pointerdown', () => {
        commandChipLine.classList.add('is-revealed');
    });

    commandChipLine.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    commandChipLine.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            commandChipLine.classList.add('is-revealed');
        }
    });
}

function fillCommand(command) {
    input.value = command;
    input.focus();
}

async function submitCommand(command) {
    const normalizedCommand = command.trim();
    if (!normalizedCommand || isAnimating) return;

    pulseTerminal();
    addOutput('<p>&nbsp;</p>');
    addOutput(`<div class="command-echo"><span class="prompt">vyasa@bd:~$ </span>${normalizedCommand}</div>`);
    commandHistory.push(normalizedCommand);
    historyIndex = commandHistory.length;
    input.value = '';
    await executeCommand(normalizedCommand);
}

function addOutput(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    output.appendChild(div);
    // output.scrollTop = output.scrollHeight;
}

function pulseTerminal() {
    if (!terminal) return;
    terminal.classList.remove('is-pulsing');
    void terminal.offsetWidth;
    terminal.classList.add('is-pulsing');
    window.setTimeout(() => {
        terminal.classList.remove('is-pulsing');
    }, 950);
}

function startAnimation(element) {
    const active = {};
    activeAnimations.set(element, active);
    isAnimating = true;
    return active;
}

function finishAnimation(element, active) {
    if (activeAnimations.get(element) === active) {
        activeAnimations.delete(element);
    }
    if (activeAnimations.size === 0) {
        isAnimating = false;
    }
}

function cancelAnimation(element) {
    activeAnimations.delete(element);
    const existingCursor = element.querySelector('.typewriter-cursor');
    if (existingCursor) existingCursor.remove();
    if (activeAnimations.size === 0) {
        isAnimating = false;
    }
}

async function sleep(element, active, delay, shouldContinue = () => true) {
    await new Promise(resolve => setTimeout(resolve, delay));
    return activeAnimations.get(element) === active && shouldContinue();
}

function getTypewriterDelay(character, baseSpeed, index, totalCharacters) {
    const progress = totalCharacters > 0 ? index / totalCharacters : 0;
    const rhythmMultiplier = progress > 0.7 ? 1.45 : 1;

    if (character === '.' || character === '!' || character === '?') {
        return 350 + Math.random() * 100;
    }

    if (character === ',') {
        return 150 + Math.random() * 50;
    }

    if (character === '\n') {
        return 400;
    }

    if (character === ' ') {
        return Math.max(baseSpeed, 220);
    }

    return Math.max(5, baseSpeed * rhythmMultiplier + (Math.random() * 10 - 5));
}

async function runTypewriterAnimation(element, text, options = {}) {
    const settings = {
        delayTime: 0,
        typeSpeed: 24,
        shouldContinue: () => true,
        ...options
    };
    const active = startAnimation(element);
    element.style.opacity = '1';
    element.style.transition = 'none';
    element.innerHTML = '';

    const stopAnimation = () => {
        const existingCursor = element.querySelector('.typewriter-cursor');
        if (existingCursor) existingCursor.remove();
        finishAnimation(element, active);
        return false;
    };

    let canContinue = await sleep(element, active, settings.delayTime, settings.shouldContinue);
    if (!canContinue) return stopAnimation();

    const typewriterCursor = document.createElement('span');
    typewriterCursor.className = 'typewriter-cursor';
    typewriterCursor.textContent = '█';
    element.appendChild(typewriterCursor);

    const characters = Array.from(text);

    for (let index = 0; index < characters.length; index++) {
        const character = characters[index];

        if (character === '\n') {
            element.insertBefore(document.createElement('br'), typewriterCursor);
        } else {
            element.insertBefore(document.createTextNode(character), typewriterCursor);
        }

        output.scrollTop = output.scrollHeight;
        canContinue = await sleep(element, active, getTypewriterDelay(character, settings.typeSpeed, index, characters.length), settings.shouldContinue);
        if (!canContinue) return stopAnimation();
    }

    canContinue = await sleep(element, active, 500, settings.shouldContinue);
    if (!canContinue) return stopAnimation();

    if (element.contains(typewriterCursor)) {
        element.removeChild(typewriterCursor);
    }

    finishAnimation(element, active);
    return true;
}

async function typeWriter(element, text, speed = 24) {
    return runTypewriterAnimation(element, text, {
        delayTime: 0,
        typeSpeed: speed
    });
}

async function bootSequence() {
    isAnimating = true;
    const bootContainer = document.querySelector('.boot-sequence');
    bootContainer.innerHTML = '';
    
    const bootMessages = [
        '∵ [sys_daily] vedic_kernel booting',
        '∵ [sys_daily] sankhya.sys loading',
        '∵ [sys_daily] /consciousness mounting',
        '∵ [sys_daily] vyasad4s_daemon starting',
        '∵ [sys_bhakti] 🦚 bhakti_daily initialized',
        ' ',
        "∵ [sys_cmd] ready :: type 'help'",
        ' '
    ];
    
    // Show boot messages line by line (no typewriter)
    for (let i = 0; i < bootMessages.length; i++) {
        const p = document.createElement('p');
        p.textContent = bootMessages[i];
        bootContainer.appendChild(p);
        output.scrollTop = output.scrollHeight;
        await new Promise(resolve => setTimeout(resolve, 150)); // Fast line-by-line
    }
    
    isAnimating = false;
    input.focus();
}

async function typeSubheader() {
    const subtitle = document.querySelector('.subtitle');
    const lines = [
        '∵ [sys_bhakti] VY4S4D4S T3RM1N4L v1.0',
        '∵ [sys_bhakti] Vedic Knowledge Compiler / Maya Exploitation Framework'
    ];
    
    subtitle.innerHTML = '';
    
    for (let line of lines) {
        const p = document.createElement('p');
        subtitle.appendChild(p);
        
        await runTypewriterAnimation(p, line, {
            delayTime: 80,
            typeSpeed: 8
        });
    }
}

async function executeCommand(cmd) {
    const parts = cmd.toLowerCase().split(' ');
    const command = parts[0];
    const args = parts.slice(1);
    let shouldScrollAfterCommand = true;

    switch(command) {
        case 'help':
            showHelp();
            break;
        case 'today':
            await loadVerse(getTodayDate());
            shouldScrollAfterCommand = false;
            break;
        case 'yesterday':
            await loadVerse(getYesterdayDate());
            shouldScrollAfterCommand = false;
            break;
        case 'verses':
            window.location.href = 'verse.html';
            break;
        case 'cosmic':
            window.location.href = 'c0sm1c.html';
            break;
        case 'archive':
            window.location.href = 'c0sm1c4rch1v3.html';
            break;
        case 'glossary':
            window.location.href = 'glossary.html';
            break;
        case 'clear':
            output.innerHTML = '';
            break;
        case 'about':
            showAbout();
            break;
        case 'chant':
            await showChant();
            break;
        default:
            // Check if it's a date (YYYY-MM-DD)
            if (/^\d{4}-\d{2}-\d{2}$/.test(command)) {
                await loadVerse(command);
                shouldScrollAfterCommand = false;
            } else {
                addOutput(`<p class="error">∵ [sys_error] Command not found: ${command}</p><p>Type 'help' for available commands</p>`);
            }
    }
    // Scroll to show command output
    if (shouldScrollAfterCommand) {
        output.scrollTop = output.scrollHeight;
    }
}

function showHelp() {
    addOutput(`
        <p>&nbsp;</p>
        <p class="verse-header">∵ [sys_cmd] available_commands</p>
        <p><strong>[help]</strong>       Show this help message</p>
        <p><strong>[about]</strong>      About this terminal</p>
        <p><strong>[verses]</strong>     Open verse index</p>
        <p><strong>[cosmic]</strong>     Open cosmic flow</p>
        <p><strong>[archive]</strong>    Open cosmic archive</p>
        <p><strong>[glossary]</strong>   View Sanskrit glossary</p>
        <p><strong>[today]</strong>      Display today's verse</p>
        <p><strong>[yesterday]</strong>  Display yesterday's verse</p>
        <p><strong>[chant]</strong>      Chant the maha-mantra</p>
        <p><strong>[YYYY-MM-DD]</strong> Display verse for specific date</p>
        <p><strong>[clear]</strong>      Clear terminal</p>
        <p>&nbsp;</p>
        <p class="verse-header">∵ [sys_cmd] keyboard</p>
        <p><strong>[↑/↓]</strong>        Navigate command history</p>
        <p>&nbsp;</p>
    `);
}

function showAbout() {
    addOutput(`
        <p>&nbsp;</p>
        <p class="verse-header">∵ [sys_bhakti] about_terminal</p>
        <p>Daily verses from Bhagavad Gita As It Is and Srimad Bhagavatam,</p>
        <p>with connections to Patanjali's Yoga Sutras.</p>
        <p>&nbsp;</p>
        <p>Approaching yoga from first principles - Sankhya metaphysics.</p>
        <p>Vedic knowledge as source code. Yoga as the exploit.</p>
        <p>&nbsp;</p>
        <p>Compiled by: vyasad4s</p>
        <p>Sources: vedabase.io, Vyasa Bhashya</p>
        <p>&nbsp;</p>
    `);
}

function getTodayDate() {
    return formatDate(new Date());
}

async function showChant() {
    if (currentChantSession?.active) {
        addOutput('<p class="system-line">∵ [sys_cmd] chant_already_running</p>');
        return;
    }

    addOutput('<p>&nbsp;</p>');
    const chantSession = document.createElement('div');
    chantSession.className = 'chant-session';

    const chantHeader = document.createElement('p');
    chantHeader.className = 'chant-output chant-header';
    chantHeader.textContent = '🦚CHANT!';

    const chant = document.createElement('p');
    chant.className = 'chant-output';

    const controls = document.createElement('p');
    controls.className = 'chant-controls';

    const stopButton = document.createElement('button');
    stopButton.type = 'button';
    stopButton.className = 'chant-stop';
    stopButton.textContent = '[stop]';

    const counter = document.createElement('span');
    counter.className = 'chant-counter';
    counter.textContent = 'rounds: 0000';

    controls.appendChild(stopButton);
    controls.appendChild(document.createTextNode(' '));
    controls.appendChild(counter);
    chantSession.appendChild(chantHeader);
    chantSession.appendChild(chant);
    chantSession.appendChild(controls);
    output.appendChild(chantSession);

    const session = {
        active: true,
        rounds: 0,
        element: chant
    };
    currentChantSession = session;

    stopButton.addEventListener('click', (e) => {
        e.stopPropagation();
        session.active = false;
        cancelAnimation(chant);
    });

    while (session.active) {
        const completed = await runTypewriterAnimation(
            chant,
            'hare kṛṣṇa hare kṛṣṇa\nkṛṣṇa kṛṣṇa hare hare\nhare rāma hare rāma\nrāma rāma hare hare',
            {
                delayTime: 80,
                typeSpeed: 24,
                shouldContinue: () => session.active
            }
        );

        if (!completed) break;

        session.rounds += 1;
        counter.textContent = `rounds: ${String(session.rounds).padStart(4, '0')}`;
    }

    if (currentChantSession === session) {
        currentChantSession = null;
    }
}

function getYesterdayDate() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return formatDate(yesterday);
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

async function loadVerse(date) {
    try {
        // Show loading message
        const loadingDiv = document.createElement('div');
        loadingDiv.innerHTML = '<p class="system-line">∵ [sys_transmit] 🐚 compiling_verse</p>';
        output.appendChild(loadingDiv);
        
        const response = await fetch(`verses/${date}.html`);
        if (response.ok) {
            const html = await response.text();
            loadingDiv.remove();
            
            addOutput('<p class="system-line">∵ [sys_bhakti] 🦚 daily_verse_loaded</p><p>&nbsp;</p>');

            // Just add the HTML directly without typewriter effect on verse content
            addOutput(html);
        } else {
            loadingDiv.remove();
            addOutput(`<p class="error">∵ [sys_error] No verse found for ${date}</p><p>Vyasad4s hasn't compiled this date yet.</p>`);
        }
    } catch (error) {
        addOutput(`<p class="error">∵ [sys_error] Error loading verse: ${error.message}</p>`);
    }
}

// Run on page load
window.addEventListener('load', async () => {
    pulseTerminal();
    // Type out subheader first
    await typeSubheader();
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Then boot sequence
    await bootSequence();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Then load today's verse
    addOutput(`<p>&nbsp;</p>`);
    await loadVerse(getTodayDate());
});
