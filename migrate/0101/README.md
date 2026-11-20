# 0101 Technology migration (0101technology.com)

| File | What it is |
|:---|:---|
| `out/MIGRATION-REPORT.pdf` | Complexity analysis, decisions, risks, effort and status |
| `out/AUTHOR-GUIDE.pdf` | Guide for WordPress and static-site authors editing the site in Experience Workspace |
| `MIGRATION-REPORT.md`, `AUTHOR-GUIDE.md` | Sources of the two PDFs (`./build.sh NAME [png]` rebuilds one) |
| `kit.typ` | Shared visual components for both PDFs |
| `img/orig-*.jpg` | Screenshots of the original site |
| `img/prev-*.jpg`, `img/blk-*.jpg`, `img/sec-*.jpg` | Screenshots of the migrated preview |

Where the migration itself lives:

- Pages: `content/0101/` (index, samples, security, privacy, contact, certifications, nav, footer)
- Images: `content/media-da/0101/`
- Import: `tools/importer/import-studio-view.js`, `tools/importer/import-certifications.js`, parsers and `0101-*` transformers, and `0101-download-media.js`
- Code: `blocks/{stats,agent-mesh,showcase,feature-grid,facts,contact-form,certifications}/`, `styles/studio-0101.css`, `fonts/space-grotesk-latin.woff2`, `fonts/jetbrains-mono-latin.woff2`, plus small changes to `scripts/scripts.js` (theme loading, Section Metadata) and `blocks/header/header.js` (current-page highlight)
