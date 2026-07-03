import json
from datetime import datetime

# Load the verses index
with open('/Users/axl/Documents/web-projects/bhakti-daily/data/verses-index.json', 'r') as f:
    data = json.load(f)

# Create new entry for today
new_entry = {
    "date": "2026-06-22",
    "source": "BG 8.15",
    "chapter": 8,
    "verse": 15,
    "text": "Bhagavad Gita",
    "tithi": "Sukla Paksha Ashtami (until 06:10 AM EDT), then Sukla Paksha Navami",
    "nakshatra": "Hasta (until 02:23 AM EDT), then Chitra",
    "yoga": "Variyan (until 12:43 AM EDT), then Parigha",
    "themes": [
        "SupremeGoal",
        "Navami",
        "Hasta",
        "Variyan",
        "Parigha",
        "BG815",
        "BhaktiYoga",
        "Sankhya"
    ],
    "tags": [
        "#SupremeGoal",
        "#Navami",
        "#Hasta",
        "#Variyan",
        "#Parigha",
        "#BG815",
        "#BhaktiYoga",
        "#Sankhya"
    ],
    "yogaSutraConnection": "YS 1.23",
    "sankhyaConcepts": [
        "puruṣa-prakṛti dualism",
        "the material world as duḥkhālayam (place of misery)",
        "the Supreme’s abode as paramā gati (ultimate destination)",
        "the living entity’s bondage to punar janma (repeated birth)",
        "liberation as saṁsiddhi (highest perfection)"
    ],
    "keyTerms": [
        "mām",
        "upetya",
        "punar janma",
        "duḥkhālayam",
        "aśāśvatam",
        "nāpnuvanti",
        "mahātmānaḥ",
        "saṁsiddhiṁ",
        "paramāṁ",
        "gatāḥ"
    ]
}

# Insert at the beginning (most recent first)
data['verses'].insert(0, new_entry)

# Update lastUpdated
data['lastUpdated'] = datetime.now().strftime('%Y-%m-%d')

# Write back
with open('/Users/axl/Documents/web-projects/bhakti-daily/data/verses-index.json', 'w') as f:
    json.dump(data, f, indent=2)

print("Added today's entry to verses-index.json")