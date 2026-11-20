#!/bin/bash
# Build the Migration Report and Author Guide PDFs for one migrated site and expose them in the
# preview exactly like the WKND reports: content/<PREFIX>-<NAME>.pdf plus a download page
# content/<PREFIX>-<NAME>.html (<body><main>…<a href="./<PREFIX>-<NAME>.pdf">) at the content root.
# The platform's content sync picks up that pair.
#
# Usage (from the project root):
#   .claude/skills/migration-report-pdfs/scripts/publish-reports.sh migrate/0101 0101
#   <dir>    folder holding MIGRATION-REPORT.md, AUTHOR-GUIDE.md, kit.typ and img/
#   <prefix> short site id used in file names (0101 -> content/0101-AUTHOR-GUIDE.pdf)
# CONTENT_DIR overrides the output folder (default: content) for dry runs.
set -euo pipefail
DIR="$(realpath "$1")"
PREFIX="$2"
CONTENT="${CONTENT_DIR:-$(pwd)/content}"
SKILL="$(realpath "$(dirname "$0")/..")"
P=/home/node/.excat-marketplaces/excat-extended/project-management
export PATH="$HOME/.local/bin:$PATH" TYPST_FONT_PATHS="$P/fonts"

[ -f "$DIR/kit.typ" ] || cp "$SKILL/kit.typ" "$DIR/kit.typ"
cp -f "$P/templates/adobe-whitepaper.typ" "$P/assets/Adobe_Wordmark_RGB_Red.svg" "$DIR/"
mkdir -p "$DIR/out"

for NAME in MIGRATION-REPORT AUTHOR-GUIDE; do
  [ -f "$DIR/$NAME.md" ] || { echo "missing $DIR/$NAME.md" >&2; exit 1; }
  pandoc "$DIR/$NAME.md" -t typst -s -o "$DIR/$NAME.typ" \
    -V template="adobe-whitepaper.typ" -V mainfont="Adobe Clean" -V fontsize=10pt -V papersize=a4
  typst compile --font-path "$P/fonts" "$DIR/$NAME.typ" "$DIR/out/$NAME.pdf" 2>/dev/null

  OUT="$PREFIX-$NAME"
  cp -f "$DIR/out/$NAME.pdf" "$CONTENT/$OUT.pdf"
  python3 -I "$SKILL/scripts/download-page.py" "$DIR/$NAME.md" "$CONTENT/$OUT.html" "$OUT.pdf"
  echo "published $CONTENT/$OUT.pdf and $CONTENT/$OUT.html"
done
