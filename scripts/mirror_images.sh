#!/usr/bin/env bash
# Download every Wikimedia Commons image referenced by data.js to local
# assets/ so the Tapestry works entirely offline and the caretaker can
# checksum against local copies.
#
# Usage: ./scripts/mirror_images.sh
# Requires: curl, grep, awk

set -euo pipefail
cd "$(dirname "$0")/.."

OUT="assets/img"
mkdir -p "$OUT"

echo "→ extracting image filenames from data.js…"
# grep the "file:" lines from WM(...) calls and the one hardcoded URL format
FILES=$(grep -oE "WM\('[^']+'" data.js | sed -E "s/WM\('//; s/'//")

COUNT=0
OK=0
FAIL=0
for f in $FILES; do
  COUNT=$((COUNT + 1))
  # URL-decode the filename for local storage (best effort)
  local_name=$(echo "$f" | sed 's/%20/ /g; s/%27/'\''/g')
  out_path="$OUT/${local_name}"
  if [ -f "$out_path" ]; then
    OK=$((OK + 1))
    continue
  fi
  url="https://commons.wikimedia.org/wiki/Special:FilePath/${f}?width=900"
  echo "  ↓ $f"
  if curl -sSL --max-time 30 -o "$out_path" "$url" && [ -s "$out_path" ]; then
    OK=$((OK + 1))
  else
    FAIL=$((FAIL + 1))
    rm -f "$out_path"
    echo "    ! failed: $f" >&2
  fi
done

echo
echo "done. $OK / $COUNT ok, $FAIL failed."
echo "to switch the Tapestry to offline images, replace the WM() helper in"
echo "data.js with: const WM = (f) => \`assets/img/\${f}\`;"
