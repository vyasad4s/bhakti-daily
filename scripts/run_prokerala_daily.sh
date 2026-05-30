#!/bin/zsh
set -euo pipefail

REPO="/Users/axl/Documents/web-projects/bhakti-daily"
LOG_DIR="/Users/axl/Library/Logs/bhakti-daily"

mkdir -p "$LOG_DIR"

cd "$REPO"

/usr/bin/python3 scripts/fetch_prokerala_daily.py

# Only add the Prokerala script and panchang data.
# This avoids accidentally committing unrelated untracked files from vyasad4s.
git add scripts/fetch_prokerala_daily.py scripts/run_prokerala_daily.sh data/panchang/*.json

git commit -m "Add daily Prokerala panchang data" || true

git push || true
