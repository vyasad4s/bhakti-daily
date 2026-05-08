const fs = require('fs');

const data = JSON.parse(fs.readFileSync('data/glossary.json'));
const glossary = data.terms;

const newTerms = [
  {
    term: "brahmaṇy ādhāya",
    transliteration: "brahmaṇi ādhāya",
    definition: "Placing one's actions into the Absolute; transferring ownership of the result to the Supreme.",
    root: "√धा (dhā) — to place",
    references: ["BG 5.10"],
    themes: ["surrender"]
  },
  {
    term: "saṅgaṁ tyaktvā",
    transliteration: "saṅgaṁ tyaktvā",
    definition: "Abandoning attachment; removing the psychic 'glue' that binds the soul to material outcomes.",
    root: "√त्यज् (tyaj) — to abandon",
    references: ["BG 5.10"],
    themes: ["detachment"]
  },
  {
    term: "na lipyate",
    transliteration: "na lipyate",
    definition: "Not sticking; the state of the soul that remains untouched by karmic residue, like a lotus leaf in water.",
    root: "√लिप् (lip) — to stick",
    references: ["BG 5.10"],
    themes: ["liberation"]
  },
  {
    term: "Pūrva Phālgunī",
    transliteration: "pūrva phālguni",
    definition: "The 'Early Autumn' nakṣatra ruled by Bhaga (God of Luck). A time of creative abundance and the challenge of maintaining detachment amidst luxury.",
    references: ["Panchanga 2026-05-07"],
    themes: ["creativity", "surrender", "luxury-trap"]
  }
];

newTerms.forEach(newTerm => {
  const exists = glossary.find(entry => entry.term === newTerm.term);
  if (!exists) {
    glossary.push(newTerm);
  }
});

glossary.sort((a, b) => a.term.localeCompare(b.term));
data.terms = glossary;
data.lastUpdated = "2026-05-07";

fs.writeFileSync('data/glossary.json', JSON.stringify(data, null, 2));
