import json
import re
from datetime import datetime

# Load the glossary
with open('/Users/axl/Documents/web-projects/bhakti-daily/data/glossary.json', 'r') as f:
    glossary = json.load(f)

# Terms to add from the verse
terms_to_add = [
    {
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
    },
    {
        "term": "upetya",
        "transliteration": "",
        "type": "gerund",
        "definition": "achieving; hacker metaphor: a successful system call that returns the desired resource handle",
        "roots": "",
        "references": [
            "BG 8.15"
        ],
        "themes": [
            "Achievement",
            "Devotion"
        ],
        "date": "2026-06-22"
    },
    {
        "term": "punar janma",
        "transliteration": "",
        "type": "compound",
        "definition": "again birth; hacker metaphor: an infinite loop with no exit condition (samsara)",
        "roots": "",
        "references": [
            "BG 8.15"
        ],
        "themes": [
            "Rebirth",
            "Samsara"
        ],
        "date": "2026-06-22"
    },
    {
        "term": "duḥkhālayam",
        "transliteration": "",
        "type": "compound",
        "definition": "place of miseries; hacker metaphor: a legacy system plagued with critical bugs and downtime",
        "roots": "",
        "references": [
            "BG 8.15"
        ],
        "themes": [
            "MaterialWorld",
            "Miseries"
        ],
        "date": "2026-06-22"
    },
    {
        "term": "aśāśvatam",
        "transliteration": "",
        "type": "adjective",
        "definition": "temporary; hacker metaphor: a staging environment, not production",
        "roots": "",
        "references": [
            "BG 8.15"
        ],
        "themes": [
            "Temporary",
            "Material"
        ],
        "date": "2026-06-22"
    },
    {
        "term": "nāpnuvanti",
        "transliteration": "",
        "type": "verb",
        "definition": "attain; hacker metaphor: a blocking operation that eventually succeeds",
        "roots": "",
        "references": [
            "BG 8.15"
        ],
        "themes": [
            "Attainment",
            "Devotion"
        ],
        "date": "2026-06-22"
    },
    {
        "term": "mahātmānaḥ",
        "transliteration": "",
        "type": "noun plural",
        "definition": "the great souls; hacker metaphor: senior SREs with root access to the transcendental cluster",
        "roots": "",
        "references": [
            "BG 8.15"
        ],
        "themes": [
            "GreatSouls",
            "Devotees"
        ],
        "date": "2026-06-22"
    },
    {
        "term": "saṁsiddhiṁ",
        "transliteration": "",
        "type": "noun",
        "definition": "perfection; hacker metaphor: five nines (99.999%) uptime in devotional service",
        "roots": "",
        "references": [
            "BG 8.15"
        ],
        "themes": [
            "Perfection",
            "Liberation"
        ],
        "date": "2026-06-22"
    },
    {
        "term": "paramāṁ",
        "transliteration": "",
        "type": "adjective",
        "definition": "ultimate; hacker metaphor: the root namespace, beyond which nothing exists",
        "roots": "",
        "references": [
            "BG 8.15"
        ],
        "themes": [
            "Ultimate",
            "Supreme"
        ],
        "date": "2026-06-22"
    },
    {
        "term": "gatāḥ",
        "transliteration": "",
        "type": "participle",
        "definition": "having achieved; hacker metaphor: a greenfield deploy with all tests passing",
        "roots": "",
        "references": [
            "BG 8.15"
        ],
        "themes": [
            "Achievement",
            "Liberation"
        ],
        "date": "2026-06-22"
    }
]

# Get existing terms
existing_terms = {t['term']: i for i, t in enumerate(glossary['terms'])}

# Add or update each term
for term in terms_to_add:
    term_name = term['term']
    if term_name in existing_terms:
        # Update existing term
        glossary['terms'][existing_terms[term_name]] = term
        print(f"Updated term: {term_name}")
    else:
        # Insert in alphabetical order
        inserted = False
        for i, existing_term in enumerate(glossary['terms']):
            if existing_term['term'] > term_name:
                glossary['terms'].insert(i, term)
                inserted = True
                break
        if not inserted:
            glossary['terms'].append(term)
        print(f"Added term: {term_name}")

# Update lastUpdated
glossary['lastUpdated'] = datetime.now().strftime('%Y-%m-%d')

# Validate JSON by loading it again
try:
    json.dumps(glossary)
    print("JSON validation passed")
except Exception as e:
    print(f"JSON validation failed: {e}")
    sys.exit(1)

# Write back
with open('/Users/axl/Documents/web-projects/bhakti-daily/data/glossary.json', 'w') as f:
    json.dump(glossary, f, indent=2)

print(f"Successfully updated glossary with {len(terms_to_add)} terms")