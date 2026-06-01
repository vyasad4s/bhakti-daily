const terminal = document.querySelector('.terminal');
const commandChipLine = document.querySelector('.command-chip-line');
const glossaryList = document.getElementById('glossary-list');

function pulseTerminal() {
    if (!terminal) return;
    terminal.classList.remove('is-pulsing');
    void terminal.offsetWidth;
    terminal.classList.add('is-pulsing');
    window.setTimeout(() => {
        terminal.classList.remove('is-pulsing');
    }, 950);
}

function renderGlossaryTerm(item) {
    const term = document.createElement('div');
    term.className = 'glossary-term';

    const name = document.createElement('p');
    name.className = 'term-name';
    name.textContent = `[${item.term}]`;

    const definition = document.createElement('p');
    definition.className = 'term-def';
    definition.innerHTML = item.definition;

    term.appendChild(name);
    term.appendChild(definition);
    return term;
}

async function loadGlossary() {
    try {
        const response = await fetch('data/glossary.json');

        if (!response.ok) {
            throw new Error('Glossary data unavailable');
        }

        const data = await response.json();

        if (!data.terms || data.terms.length === 0) {
            return;
        }

        glossaryList.innerHTML = '';
        data.terms.forEach((item) => {
            glossaryList.appendChild(renderGlossaryTerm(item));
        });
    } catch (error) {
        console.error('Error loading glossary:', error);
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
    setupCommandReveal();
    await loadGlossary();
});
