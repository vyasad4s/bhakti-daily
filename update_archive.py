import re
from datetime import datetime

# Read the archive file
with open('/Users/axl/Documents/web-projects/bhakti-daily/c0sm1c4rch1v3.html', 'r') as f:
    content = f.read()

# Define the new entry for 2026-06-22
new_entry = '''        <li>
          <span style="color: #ff9933;">2026-06-22</span>
          <a href="c0sm1c.html?date=2026-06-22">[cosmic]</a>
          <a href="verse.html?date=2026-06-22" class="verse-link">[verse]</a>
          <span class="meta">Ashtami Tithi (until 06:10 AM EDT), then Navami | Hasta (until 02:23 AM EDT), then Chitra | Variyan (until 12:43 AM EDT), then Parigha | BG 8.15</span>
        </li>'''

# Find the position after the 2026-06-21 entry
pattern = r'(<li>.*?2026-06-21.*?</li>\s*)'
match = re.search(pattern, content, re.DOTALL)
if match:
    insert_pos = match.end()
    # Insert the new entry
    content = content[:insert_pos] + new_entry + '\n' + content[insert_pos:]
    print("Inserted entry for 2026-06-22")
else:
    print("Could not find 2026-06-21 entry")

# Write back
with open('/Users/axl/Documents/web-projects/bhakti-daily/c0sm1c4rch1v3.html', 'w') as f:
    f.write(content)

print("Updated archive file")