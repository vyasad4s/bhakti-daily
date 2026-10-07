import json
import sys
with open('data/glossary.json', 'r', encoding='utf-8') as f:
    glossary = json.load(f)
existing_terms = {entry['term'].lower(): entry for entry in glossary.get('terms', [])}
# new terms from extract_terms2.py output
new_terms = [
  {"term": "bhāsayate", "definition": "illumines, causes to shine; like rendering an object onto the display"},
  {"term": "sūryaḥ", "definition": "the sun; the system's primary external light source"},
  {"term": "dhāma", "definition": "abode, domain, seat; the root directory of reality"},
  {"term": "paramam", "definition": "supreme, beyond which nothing exists; the top of the stack"},
  {"term": "nivartante", "definition": "they return, come back; a function with no return path"},
  {"term": "gatvā", "definition": "having gone; the paradox of arriving at your own nature"}
]
added = []
for nt in new_terms:
    key = nt['term'].lower()
    if key not in existing_terms:
        # glossary expects transliteration field and maybe type, references, themes.
        # We'll follow the existing schema: term (display), transliteration (lowercase without diacritics? Actually they keep transliteration as lowercase ASCII? Look at existing: 'Abhyāsa' has transliteration 'abhyāsa' (lowercase with diacritics). We'll keep the term as the display (with diacritics) and transliteration as lowercase version (maybe same as term but lowercased?).
        # For simplicity, we'll copy the pattern: term = original (as we want to display), transliteration = lowercase of term (but keep diacritics? In existing, term 'Abhyāsa' transliteration 'abhyāsa' (lowercased). So we'll do that.
        entry = {
            "term": nt['term'],  # keep original case? Actually they capitalize first letter? Let's see: 'Abhyāsa' capital A, 'Adveṣṭā' capital A, 'Anurādhā' capital A, 'Anādī' capital A, 'Buddhi' capital B. So they capitalize first letter. We'll do the same.
            "transliteration": nt['term'].lower(),  # lowercase but keep diacritics
            "definition": nt['definition'],
            # optional fields: we can leave them empty or default.
            "roots": "",
            "references": [],
            "themes": []
        }
        glossary['terms'].append(entry)
        added.append(nt['term'])
    else:
        print(f"Term '{nt['term']}' already exists, skipping.")
if added:
    glossary['lastUpdated'] = '2026-10-04'
    # sort terms by term (case-insensitive)
    glossary['terms'].sort(key=lambda x: x['term'].lower())
    with open('data/glossary.json', 'w', encoding='utf-8') as f:
        json.dump(glossary, f, indent=2, ensure_ascii=False)
    print(f"Added terms: {added}")
else:
    print("No new terms added.")
