# Format Update Receipt: 2026-06-27

**Files updated (staging):**
- `~/workspace/bhakti-daily-staging/bhakti-daily/verses/2026-06-27.html`
- `~/workspace/bhakti-daily-staging/bhakti-daily/cosmic/2026-06-27.html`

**Files copied to live repo:**
- `~/Documents/web-projects/bhakti-daily/verses/2026-06-27.html`
- `~/Documents/web-projects/bhakti-daily/cosmic/2026-06-27.html`

**Shared files backed up:**
- `~/Documents/web-projects/bhakti-daily/data/backups/2026-06-27/verses-index.before-2026-06-27-$(date +%H%M%S)`
- `~/Documents/web-projects/bhakti-daily/data/backups/2026-06-27/c0sm1c4rch1v3.before-2026-06-27-$(date +%H%M%S)`

**Shared files modified:**
- `~/Documents/web-projects/bhakti-daily/data/verses-index.json` (updated entry for 2026-06-27 with corrected fields; deduplicated)
- `~/Documents/web-projects/bhakti-daily/c0sm1c4rch1v3.html` (added list item for 2026-06-27)

**Validation performed:**
- Verified JSON validity of `verses-index.json`
- Verified HTML files are well-formed (no syntax errors)
- Deduplicated entries in verses-index.json

**Commit message (to be used):**
`Format update 2026-06-27: align verse/cosmic inserts with current style`

**Errors or warnings:** None

**Notes:**
- The verse and cosmic files were updated to match the current formatting style (`.verse-content` wrapper, `.verse-header` with 🏹 emoji, `<p class="sanskrit">` tags, `<p class="translation">` with `<strong>`, etc.).
- The `verses-index.json` had duplicate entries for 2026-06-27 which were deduplicated.
- The `c0sm1c4rch1v3.html` archive was updated with the correct entry for 2026-06-27.