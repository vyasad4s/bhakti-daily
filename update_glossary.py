import json
import sys
from datetime import datetime

# Load the glossary
with open('/Users/axl/Documents/web-projects/bhakti-daily/data/glossary.json', 'r') as f:
    glossary = json.load(f)

# Define the new term
new_term = {
    "term": "mām",
    "transliteration": "",
    "type": "noun",
    "definition": "Me; hacker metaphor: the divine process ID (PID 1) of all existence",
    "roots": "",
    "references": [
        "BG 8.15"
    ],
    "themes": [
        "SupremePerson",
        "Devotion"
    ],
    "date": "2026-06-22"
}

# Check if term already exists
terms = glossary['terms']
existing_indices = [i for i, t in enumerate(terms) if t['term'] == 'mām']
if existing_indices:
    print("Term 'mām' already exists in glossary")
    # Update existing term
    terms[existing_indices[0]] = new_term
else:
    # Insert in alphabetical order
    inserted = False
    for i, term in enumerate(terms):
        if term['term'] > 'mām':
            terms.insert(i, new_term)
            inserted = True
            break
    if not inserted:
        terms.append(new_term)

# Update lastUpdated
glossary['lastUpdated'] = datetime.now().strftime('%Y-%m-%d')

# Write back
with open('/Users/axl/Documents/web-projects/bhakti-daily/data/glossary.json', 'w') as f:
    json.dump(glossary, f, indent=2)

print("Added/updated term 'mām' in glossary.json")