const output = document.getElementById('output');
const terminal = document.querySelector('.terminal');
const commandChipLine = document.querySelector('.command-chip-line');
const commandInput = document.getElementById('command-input');
const dateDisplay = document.getElementById('date-display');
const verseContainer = document.getElementById('verse-container');
const prevLink = document.getElementById('prev-link');
const nextLink = document.getElementById('next-link');

const dateParam = getQueryParam('date') || getTodayDate();

function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function getTodayDate() {
    return formatDate(new Date());
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatDisplayDate(dateStr) {
    const date = new Date(`${dateStr}T00:00:00`);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function navigate(days) {
    const currentDate = new Date(`${dateParam}T00:00:00`);
    currentDate.setDate(currentDate.getDate() + days);
    window.location.href = `verse.html?date=${formatDate(currentDate)}`;
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

async function loadVerse(date) {
    try {
        verseContainer.innerHTML = '<p class="loading">∵ [sys_transmit] 🐚 compiling_verse_data</p>';
        const response = await fetch(`verses/${date}.html`);

        if (!response.ok) {
            throw new Error(`Verse not found for ${date}`);
        }

        const html = await response.text();
        verseContainer.innerHTML = html;
    } catch (error) {
        verseContainer.innerHTML = `
            <div class="error-message">
                <p class="error">∵ [sys_error] ${error.message}</p>
                <p>Vyasad4s has not compiled this date yet.</p>
            </div>
        `;
    }
}

function setupNavigation() {
    dateDisplay.textContent = formatDisplayDate(dateParam);
    if (commandInput) {
        commandInput.value = `verse --date ${dateParam}`;
    }

    prevLink.addEventListener('click', () => navigate(-1));
    nextLink.addEventListener('click', () => navigate(1));

    if (dateParam === getTodayDate()) {
        nextLink.hidden = true;
    }
}

function setupCommandReveal() {
    if (!commandChipLine) return;

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

window.addEventListener('load', async () => {
    pulseTerminal();
    setupNavigation();
    setupCommandReveal();
    await loadVerse(dateParam);
});
