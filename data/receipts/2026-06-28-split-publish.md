# Split & Publish Receipt: 2026-06-28

**Files created (staging):**
- `~/workspace/bhakti-daily-staging/bhakti-daily/verses/2026-06-28.html`
- `~/workspace/bhakti-daily-staging/bhakti-daily/cosmic/2026-06-28.html`

**Files copied to live repo:**
- `~/Documents/web-projects/bhakti-daily/verses/2026-06-28.html`
- `~/Documents/web-projects/bhakti-daily/cosmic/2026-06-28.html`

**Shared files backed up:**
- `~/Documents/web-projects/bhakti-daily/data/backups/2026-06-28/verses-index.before-2026-06-28-$(date +%H%M%S)`
- `~/Documents/web-projects/bhakti-daily/data/backups/2026-06-28/c0sm1c4rch1v3.before-2026-06-28-$(date +%H%M%S)`

**Shared files modified:**
- `~/Documents/web-projects/bhakti-daily/data/verses-index.json` (updated entry for 2026-06-28 with corrected fields)
- `~/Documents/web-projects/bhakti-daily/c0sm1c4rch1v3.html` (updated the meta line for 2026-06-28 entry)

**Validation performed:**
- Verified JSON validity of `verses-index.json`
- Verified HTML files are well-formed (no syntax errors)

**Commit message (to be used):**
`Fix 2026-06-28: update verse and cosmic fragments with correct content and formatting`

**Errors or warnings:** None

**Notes:**
- The verse and cosmic files were completely blank (only empty divs). We have now populated them with the full content from the draft, properly formatted to match the current style.
- The verses-index.json entry for 2026-06-28 had incomplete or placeholder data (e.g., only "BG 8.13" with minimal fields). We have updated it with the full details matching the draft.
- The cosmic HTML file already existed with correct content; we only needed to ensure the meta line in the date list matched the updated content (which we did).