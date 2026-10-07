import json
with open('data/verses-index.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
print('Data type:', type(data))
print('Keys:', data.keys())
today = '2026-10-04'
for v in data['verses']:
    if v['date'] == today:
        print('Today already exists in index')
        exit(0)
new_entry = {
    'date': today,
    'source': 'BG 15.6',
    'chapter': 15,
    'verse': 6,
    'text': 'Bhagavad Gita',
    'tithi': 'Kṛṣṇa Pakṣa Navamī (until 6:24 PM EDT), then Daśamī — Avidhava Navami observed',
    'nakshatra': 'Punarvasu (until 2:43 PM EDT), then Puṣya',
    'yoga': 'Śiva (until 12:21 AM EDT Oct 5), then Siddha',
    'themes': [
        'self-luminous',
        'borrowed-light',
        'ravivāra',
        'punarvasu',
        'ravipushya',
        'sarvarthasiddhi',
        'śivayoga',
        'avidhavanavami'
    ],
    'tags': [
        '#self-luminous',
        '#borrowed-light',
        '#ravivāra',
        '#punarvasu',
        '#ravipushya',
        '#sarvarthasiddhi',
        '#śivayoga',
        '#avidhavanavami'
    ],
    'yogaSutraConnection': 'YS I.3, YS IV.34',
    'sankhyaConcepts': [
        'puruṣa as self-luminous cit',
        'prakṛti as jaḍa (insentient)',
        'material illuminators as evolutes',
        'abode as substrate of light'
    ],
    'keyTerms': [
        'bhāsayate',
        'sūryaḥ',
        'dhāma',
        'paramam',
        'nivartante',
        'gatvā'
    ]
}
data['verses'].insert(0, new_entry)
data['lastUpdated'] = today
with open('data/verses-index.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
print('Added entry for', today)
