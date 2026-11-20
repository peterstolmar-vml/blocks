#!/bin/bash
# Build an Adobe-branded PDF (and optional PNG page previews) from a guide markdown file.
# Usage: ./build.sh NAME [png]   e.g. ./build.sh MIGRATION-REPORT png
set -e
cd "$(dirname "$0")"
export PATH="$HOME/.local/bin:$PATH"
P=/home/node/.excat-marketplaces/excat-extended/project-management
export TYPST_FONT_PATHS="$P/fonts"
cp -f "$P/templates/adobe-whitepaper.typ" "$P/assets/Adobe_Wordmark_RGB_Red.svg" .
NAME="$1"
pandoc "$NAME.md" -t typst -s -o "$NAME.typ" \
  -V template="adobe-whitepaper.typ" -V mainfont="Adobe Clean" -V fontsize=10pt -V papersize=a4
typst compile --font-path "$P/fonts" "$NAME.typ" "out/$NAME.pdf"
if [ "$2" = "png" ]; then
  rm -rf "out/$NAME-png" && mkdir -p "out/$NAME-png"
  typst compile --font-path "$P/fonts" --format png --ppi 60 "$NAME.typ" "out/$NAME-png/p{0p}.png"
  FILES=( "out/$NAME-png"/p*.png ); i=0; r=1
  while [ $i -lt ${#FILES[@]} ]; do
    convert "${FILES[@]:$i:5}" +append "out/$NAME-sheet$r.png"; i=$((i+5)); r=$((r+1))
  done
fi
ls -la "out/$NAME.pdf"
