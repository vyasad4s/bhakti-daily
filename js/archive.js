const terminal = document.querySelector('.terminal');
const output = document.getElementById('output');
const commandChipLine = document.querySelector('.command-chip-line');
const clearButton = document.getElementById('archive-clear');

function pulseTerminal() {
    if (!terminal) return;
    terminal.classList.remove('is-pulsing');
    void terminal.offsetWidth;
    terminal.classList.add('is-pulsing');
    window.setTimeout(() => {
        terminal.classList.remove('is-pulsing');
    }, 950);
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

function setupClearCommand() {
    if (!clearButton || !output) return;

    clearButton.addEventListener('click', (e) => {
        e.stopPropagation();
        pulseTerminal();
        output.innerHTML = '<p class="system-line">∵ [sys_archive] archive_output_cleared</p>';
    });
}

window.addEventListener('load', () => {
    pulseTerminal();
    setupCommandReveal();
    setupClearCommand();
});
