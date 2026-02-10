const output = document.getElementById('output');
const input = document.getElementById('command-input');
const cursor = document.querySelector('.cursor');

let commandHistory = [];
let historyIndex = -1;
let isAnimating = false;

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
            addOutput(`<span class="prompt">vyasad4s@vedic-kernel:~$ </span>${command}`);
            commandHistory.push(command);
            historyIndex = commandHistory.length;
            await executeCommand(command);
            input.value = '';
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

function addOutput(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
}

async function typeWriter(element, text, speed = 30) {
    isAnimating = true;
    for (let i = 0; i < text.length; i++) {
        element.innerHTML += text.charAt(i);
        output.scrollTop = output.scrollHeight;
        await new Promise(resolve => setTimeout(resolve, speed));
    }
    isAnimating = false;
}

async function bootSequence() {
    isAnimating = true;
    const bootContainer = document.querySelector('.boot-sequence');
    bootContainer.innerHTML = '';
    
    const bootMessages = [
        '[BOOTING VEDIC KERNEL...]',
        '[LOADING SANKHYA.SYS...]',
        '[MOUNTING /CONSCIOUSNESS...]',
        '[STARTING VYASAD4S DAEMON...]',
        '[OK] BHAKTI DAILY INITIALIZED',
        ' ',
        "Type 'help' for available commands",
        ' '
    ];
    
    // Show boot messages line by line (no typewriter)
    for (let i = 0; i < bootMessages.length; i++) {
        const p = document.createElement('p');
        if (i === 4) p.className = 'success'; // The [OK] line
        else if (i < 4) p.style.color = '#ff9933'; // Boot lines
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
        'VY4S4D4S T3RM1N4L v1.0',
        'Vedic Knowledge Compiler / Maya Exploitation Framework'
    ];
    
    subtitle.innerHTML = '';
    
    for (let line of lines) {
        const p = document.createElement('p');
        subtitle.appendChild(p);
        
        for (let i = 0; i < line.length; i++) {
            p.textContent += line.charAt(i);
            await new Promise(resolve => setTimeout(resolve, 30));
        }
    }
}

async function executeCommand(cmd) {
    const parts = cmd.toLowerCase().split(' ');
    const command = parts[0];
    const args = parts.slice(1);

    switch(command) {
        case 'help':
            showHelp();
            break;
        case 'today':
            await loadVerse(getTodayDate());
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
        default:
            // Check if it's a date (YYYY-MM-DD)
            if (/^\d{4}-\d{2}-\d{2}$/.test(command)) {
                await loadVerse(command);
            } else {
                addOutput(`<p class="error">Command not found: ${command}</p><p>Type 'help' for available commands</p>`);
            }
    }
}

function showHelp() {
    addOutput(`
        <p>&nbsp;</p>
        <p class="verse-header">AVAILABLE COMMANDS:</p>
        <p>&nbsp;</p>
        <p><span style="color: #00ff00;">help</span>           - Show this help message</p>
        <p><span style="color: #00ff00;">today</span>          - Display today's verse</p>
        <p><span style="color: #00ff00;">YYYY-MM-DD</span>    - Display verse for specific date</p>
        <p><span style="color: #00ff00;">glossary</span>      - View Sanskrit glossary</p>
        <p><span style="color: #00ff00;">clear</span>         - Clear terminal</p>
        <p><span style="color: #00ff00;">about</span>         - About this terminal</p>
        <p>&nbsp;</p>
    `);
}

function showAbout() {
    addOutput(`
        <p>&nbsp;</p>
        <p class="verse-header">ABOUT VYASAD4S TERMINAL</p>
        <p>&nbsp;</p>
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
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

async function loadVerse(date) {
    try {
        // Show loading message
        const loadingDiv = document.createElement('div');
        loadingDiv.innerHTML = '<p style="color: #ff9933;">[COMPILING VERSE...]</p>';
        output.appendChild(loadingDiv);
        
        const response = await fetch(`verses/${date}.html`);
        if (response.ok) {
            const html = await response.text();
            loadingDiv.remove();
            
            // Just add the HTML directly without typewriter effect on verse content
            addOutput(html);
        } else {
            loadingDiv.remove();
            addOutput(`<p class="error">No verse found for ${date}</p><p>Vyasad4s hasn't compiled this date yet.</p>`);
        }
    } catch (error) {
        addOutput(`<p class="error">Error loading verse: ${error.message}</p>`);
    }
}

// Run on page load
window.addEventListener('load', async () => {
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