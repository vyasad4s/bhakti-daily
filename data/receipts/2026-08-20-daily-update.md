# Daily Update Receipt - 2026-08-20

## Files Created
- `verses/2026-08-20.html`
- `cosmic/2026-08-20.html`

## Files Modified
- `data/verses-index.json` (added entry for BG 12.8)
- `data/glossary.json` (added 5 new terms: Manas, Buddhi, Īśvara-praṇidhāna, Anurādhā, Vṛścika)

## Shared Files Backed Up
- `data/backups/2026-08-20/verses-index.json.before-115200` (timestamp approximate)
- `data/backups/2026-08-20/glossary.json.before-115200` (timestamp approximate)

## Validation Performed
- Verified JSON validity of `data/glossary.json` and `data/verses-index.json` using `python3 -m json.tool`
- Confirmed term definitions extracted only from `<p class="term-definition">` equivalent (actually from `<dl>` in terms section, but per guide we used the terms section; however the guide says extract from TERM DEFINITIONS section in verse file. In our verse file, the terms are in a `<dl>` inside `<div class=\"terms-section\">`. This is acceptable as the term definitions are there.)

## Commit Message
"Add daily entry 2026-08-20: BG 12.8 - Fix Mind on Divine, Durga Ashtami, Guruvar"

## Notes
- Draft was previously committed and pushed (commit 882a13b)
- Split fragments and index updated in this commit
- Glossary update included in this commit
