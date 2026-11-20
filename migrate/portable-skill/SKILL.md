---
name: migration-reports
description: Produce two human-readable PDF deliverables for migrating a website to AEM Edge Delivery Services (EDS) with Experience Workspace / Document Authoring (DA) as the content source — (1) a Migration Report with a complexity analysis and plan, (2) an Author Guide for the people who will edit the migrated site. Works offline from a captured site snapshot. Use for "migration report", "complexity report", "author guide", "authoring guide", "handover PDFs".
version: 1.0
inputs:
  required:
    - site_id: short id used in file names, e.g. "0101"
    - source_snapshot: folder with the captured source site (see "Offline inputs")
    - author_audience: who will author, e.g. "WordPress / static-site authors" or "AEM TouchUI authors"
  optional:
    - migrated_snapshot: folder with the migrated EDS pages (content/*.plain.html, blocks/, styles/) and preview screenshots
    - org, site: EDS org and site names, for the Quick Reference links
    - delivery_root: where the finished PDFs and download pages go (default: content/)
outputs:
  - <delivery_root>/<site_id>-MIGRATION-REPORT.pdf
  - <delivery_root>/<site_id>-MIGRATION-REPORT.html
  - <delivery_root>/<site_id>-AUTHOR-GUIDE.pdf
  - <delivery_root>/<site_id>-AUTHOR-GUIDE.html
  - work/<site_id>/  (evidence, drafts, review logs, sources of the PDFs)
---

# Migration Reports (portable, offline)

## 0. Contract

Hand over exactly four files at `delivery_root`. Each report is a capitalised `NAME.pdf` with a
matching `NAME.html` download page beside it. Nothing else counts as done. You may not:

- deliver files only inside `work/`, in a subfolder, or as lowercase `.plain.html` pages
- give the user file paths, `localhost` URLs, or navigation instructions in place of the files
- upload, preview or publish anything remotely unless the user explicitly asks in the current message
- delete or overwrite files you did not create in this run

If a step can't be completed, stop and report which gate failed and why. Don't present partial output as finished.

## 1. Roles (orchestrator plus sub-agents)

Run each role as a separate agent with its own context. The orchestrator passes only the artifacts
listed, never its own conclusions, so reviewers aren't anchored.

| Role | Reads | Writes | Must not |
|:---|:---|:---|:---|
| **Orchestrator** | everything in `work/` | `work/<site_id>/run.json` (phase status, gate results) | write report prose |
| **Inventory agent** | `source_snapshot` | `evidence/inventory.json` | guess; every entry cites a file and selector or line |
| **Analysis agent** | `inventory.json`, `source_snapshot` | `evidence/complexity.json` | rate a dimension without evidence ids |
| **Content-model agent** | `inventory.json`, `migrated_snapshot` (if any) | `evidence/content-model.json` | invent block names that don't exist in `migrated_snapshot/blocks` |
| **Screenshot agent** | snapshots | `img/orig-*.jpg`, `img/prev-*.jpg`, `img/blk-*.jpg` | crop away the element it names |
| **Writer agent** | all `evidence/*.json`, `img/` | `MIGRATION-REPORT.md`, `AUTHOR-GUIDE.md` | state a fact that isn't in evidence |
| **Fact-check agent** | drafts + evidence + snapshots (*not* the writer's notes) | `review/factcheck.json` | approve; it only lists claims and verdicts |
| **Style/readability agent** | drafts | `review/style.json` | change facts |
| **Build agent** | drafts, `img/`, templates | `out/*.pdf`, page images, the 4 delivery files | edit content |
| **QA agent** | `out/` page images, delivery files | `review/qa.json` | pass a page it did not look at |

## 2. Offline inputs

Because the run is offline, everything must be captured beforehand into `source_snapshot/`:

```
source_snapshot/
  urls.txt                     # every page URL, plus hash views (#x) for single-page apps
  pages/<slug>.html            # rendered DOM after JS ran (not just the raw HTML response)
  pages/<slug>.raw.html        # raw server HTML (to detect content built by JS)
  assets/                      # css, js, fonts, images as served
  headers/<asset>.txt          # response headers (CORP, CSP, cache) for each asset type
  screenshots/<slug>-1440.jpg  # desktop viewport
  screenshots/<slug>-390.jpg   # mobile viewport
  robots.txt, sitemap.xml
```

`migrated_snapshot/` (optional) holds the EDS repo state: `content/**/*.plain.html`, `blocks/*/`,
`styles/`, `scripts/`, `tools/importer/`, and preview screenshots per page and per block.

**Gate G0 (inputs):** every URL in `urls.txt` has a rendered page and a desktop screenshot. Fail the run if not.

## 3. Phases and quality gates

### Phase A — Inventory (Inventory agent)

Produce `evidence/inventory.json`:

```json
{
  "pages": [{"id": "P1", "url": "", "title": "", "words": 0, "template": "", "sections": [
    {"id": "P1.S1", "selector": "", "kind": "hero|text|grid|form|media|nav|footer|other", "summary": ""}]}],
  "templates": [{"name": "", "pages": ["P1"], "evidence": ["P1.S1"]}],
  "components": [{"id": "C1", "name": "", "pages": ["P1"], "selector": "", "interactive": false, "js_file": ""}],
  "content_in_code": [{"id": "K1", "what": "", "file": "", "line": 0}],
  "integrations": [{"id": "I1", "kind": "form|search|analytics|embed|api", "endpoint": "", "evidence": ""}],
  "media": {"images": 0, "video": 0, "fonts": [""], "blocked_hotlinking": false, "evidence": ""},
  "seo": {"structured_data": [""], "sitemap_urls": 0, "evidence": ""},
  "privacy_claims": [{"text": "", "page": "P1"}]
}
```

Mandatory detection checks. Each must appear in the inventory, either as a finding or as "not present":

1. **Routing:** are some pages hash views of one file, or built entirely by JS? Compare `raw.html` with the rendered DOM.
2. **Content in code:** text, lists or data arrays that exist only in JS or JSON-LD and not in the DOM.
3. **Images:** a `Cross-Origin-Resource-Policy: same-origin` header (or anti-hotlink rules) means the images must be copied, not linked.
4. **Forms:** the endpoint, server language, CAPTCHA or honeypot, and what happens after submit.
5. **Privacy promises** in the site's own policy that the new platform could break (for example "no telemetry" versus EDS RUM sampling).
6. **Structured data** whose content isn't visible on the page.

**Gate GA:** a second Inventory agent independently re-counts pages, templates, components and integrations. Counts must match exactly, or the differences must be resolved and logged.

### Phase B — Complexity analysis (Analysis agent)

Rate each dimension `low | low-medium | medium | high` using this rubric. Every rating lists evidence ids.

| Dimension | low | medium | high |
|:---|:---|:---|:---|
| Page volume | < 50 pages | 50–500 | > 500 |
| Template variety | ≤ 3 | 4–10 | > 10 |
| Site architecture | one URL per page | some JS-built or hash pages | SPA, client routing everywhere |
| Content in code | none | a few lists or data arrays | most content in JS or APIs |
| Interactive features | none or CSS only | a few custom widgets | WebGL, canvas, heavy custom JS |
| Forms and integrations | none, or mailto | 1–2 forms with a simple back end | many, auth, commerce, personalisation |
| Media | images only, linkable | blocked hotlinking or video | DAM, Dynamic Media, large video library |
| SEO and structured data | standard meta | JSON-LD to rebuild | complex hreflang, redirects, schema at scale |
| Privacy and compliance | no conflicts | wording conflicts to resolve | regulated (HIPAA, PCI), consent management |
| Author change management | audience close to documents | moderate retraining | large team, heavy workflows |

The overall level is the rounded median of the dimensions, raised one step if two or more dimensions are `high`.
Also produce: decisions taken (with reasons), a risk register (risk, level, mitigation), and an effort table
(work package, scope, range in days, with stated assumptions).

**Gate GB:** a fresh Analysis agent rates the same evidence without seeing the first ratings. Any dimension that differs by more than one step goes back for reconciliation, with both rationales logged.

### Phase C — Content model (Content-model agent)

For each source component, record: what it becomes (default content, block name and variant, section style,
metadata, nav or footer document), its authoring table shape (rows × columns, the meaning of each cell),
the authoring difficulty, and the nearest equivalent in the *author's previous tool*. If `migrated_snapshot`
exists, block names, cell orders and section styles must match the real code. Quote the block's JS
that reads each cell.

**Gate GC:** for every block card, the table shape is checked against `blocks/<name>/<name>.js` and one real `content/*.plain.html` instance. Any mismatch fails the gate.

### Phase D — Screenshots (Screenshot agent)

- `orig-<page>.jpg` for every source page (desktop) and `orig-mobile-<page>.jpg` for the home page
- `prev-<page>.jpg` and element crops `blk-<block>.jpg` and `sec-<style>.jpg` from the migrated preview
- Name each file after what it shows; the QA agent checks that it really shows that

**Gate GD:** each image is opened and described by the QA agent in one sentence. The description must match the filename's claim.

### Phase E — Writing (Writer agent)

Write `MIGRATION-REPORT.md` and `AUTHOR-GUIDE.md` (outlines in §4), using only evidence. Every number in
the text carries a hidden evidence tag such as `<!-- ev: P1,C3 -->`; the Build agent strips the tags. Plain,
direct English. Short sentences. No marketing language. Use the audience's own vocabulary (WordPress terms for
WordPress authors, AEM terms for AEM authors).

### Phase F — Review (Fact-check agent and Style agent, in parallel)

- **Fact-check:** extract every factual claim (counts, names, URLs, ratings, durations, behaviours). Give each a verdict: `supported | unsupported | contradicted`, with evidence. Any `contradicted` claim, or more than 2% `unsupported`, fails the phase.
- **Style:** check readability (sentences averaging under 22 words), consistent terms, headings in the outline order, no undefined acronyms, captions on every image.

**Gate GF:** zero contradicted claims, at most 2% unsupported, and no open style errors. Loop E → F at most 3 times, then escalate to the human.

### Phase G — Build (Build agent)

Toolchain: `pandoc` (Markdown → Typst) plus `typst` with a branded whitepaper template and a component kit
(stat tiles, level badges, callouts, meters, bar charts, comparison panels, step flows, mock document
tables, screenshot frames). Any equivalent HTML-to-PDF toolchain is acceptable if it gives the same layout.

1. Compile `out/MIGRATION-REPORT.pdf` and `out/AUTHOR-GUIDE.pdf`.
2. Render every page to PNG at about 60 ppi.
3. Copy each PDF to `<delivery_root>/<site_id>-<NAME>.pdf`.
4. Write `<delivery_root>/<site_id>-<NAME>.html`:

```html
<body>
  <main>
    <h1>{Title}</h1>
    <p>{Subtitle}.</p>
    <h2>Contents</h2>
    <ul><li>{each level-1 heading}</li></ul>
    <h2>Download</h2>
    <p><strong>Download the full PDF {report|guide}:</strong> <a href="./{site_id}-{NAME}.pdf">{site_id}-{NAME}.pdf</a></p>
  </main>
</body>
```

**Gate GG:** both PDFs open, page counts are greater than 0, no compile errors (warnings about fallback fonts are allowed), the 4 delivery files exist, and each `.html` links to a PDF that exists beside it.

### Phase H — Visual QA (QA agent)

Look at every page image. Fail on: text overflowing a table or callout, a figure split across pages, an
empty page, a missing image, an unreadable contrast, a table with a single orphaned row on a new page, or
the wrong screenshot for its caption. Log the page number and issue in `review/qa.json`. Fixes go back to E
(content) or G (layout).

**Gate GH:** `qa.json` has zero open issues.

## 4. Document outlines

### Migration Report

1. **At a Glance:** executive summary, overall level badge, 4 stat tiles (pages, templates, blocks, integrations), "where the effort really is" callout
2. **Complexity Scorecard:** a table of dimension, rating and why (from Phase B)
3. **The Source Site:** a 2×2 grid of original screenshots, "how the site is built" table, page inventory with old → new addresses
4. **Content Model:** source element → what it becomes → what authors fill in → authoring difficulty
5. **Complexity Drivers:** easy versus needs-attention comparison; decisions taken; risk register
6. **Where the Migration Stands:** progress meters plus done / still-open callouts (only if `migrated_snapshot` exists; otherwise "Not started")
7. **Plan and Effort:** step flow plus an effort table with a total and stated assumptions
8. **Moving Authors:** previous tool → new tool mapping table, with tips per audience
9. **Appendix:** full page list or asset table

### Author Guide

1. **Quick Reference:** real edit, preview and live URLs (`https://da.live/#/{org}/{site}/…`, `https://main--{site}--{org}.aem.page/…`, `.aem.live`), stat tiles, a one-sentence version
2. **What Changes for You:** previous workflow versus new workflow; six ideas to learn; a concept map table (previous tool → Experience Workspace); what you no longer do
3. **A Tour of Experience Workspace:** content browser; editor with Layout, Content and Split views; assistant panel; tools panel (Outline, Page, Files, Versions, Comments, Preflight); the Send menu; the older `/edit` editor versus `/canvas`
4. **Getting Started:** checklist, first edit in about 5 steps, how the folder is organised
5. **Anatomy of a Page:** an annotated mock document (default content, block, section metadata, section break, page metadata)
6. **Writing Text, Buttons and Links:** typing patterns and what they produce (bold link → primary button, italic → secondary)
7. **Sections and Section Styles:** a table plus screenshots of each style; warnings about order-dependent layouts
8. **Block Reference:** one card per block: header (name, as typed, difficulty, where it's used, previous-tool equivalent), preview screenshot, mock table with placeholders, "how to fill it in" bullets
9. **Navigation and Footer:** the structure of each document, with screenshots
10. **Page Metadata and Images:** metadata rows (including rows that must not be changed), image tasks, supported formats
11. **Preview and Publish:** preview versus publish, an "I want to… / do this" table (single, bulk, snapshots, preflight, versions, unpublish)
12. **Working with the AI Assistant:** good requests versus tasks not for the assistant
13. **Help and Support:** common tasks, troubleshooting (symptom → cause → fix), resources

## 5. Known failure modes (check each one)

| Symptom | Cause | Rule |
|:---|:---|:---|
| The user "can't see" the PDFs | delivered as paths, localhost links, subfolders or `.plain.html` pages | deliver only per §0 |
| All images broken in the migrated preview | the source sends `CORP: same-origin` | copy images locally, never hotlink |
| Section styles have no effect | the project's core scripts don't apply Section Metadata | verify in code before documenting styles |
| Import "completeness" is very low on every page | single-file SPA: the metric compares against the whole file | explain this; don't report it as content loss |
| Nav or footer missing in the local preview | the local server serves pages under a path prefix | use relative `nav` / `footer` metadata or verify on the real preview |
| Contact form claims are untested | testing would send real email | state "not tested end-to-end" explicitly |
| Ratings drift between runs | no rubric | use the §3 Phase B rubric and gate GB |
| Guide documents blocks that don't exist | writer worked from intent, not code | gate GC |

## 6. Final report to the user (two lines maximum)

`The Migration Report and Author Guide are ready: {site_id}-MIGRATION-REPORT and {site_id}-AUTHOR-GUIDE, each with a PDF download.`
Then add one line listing any gate that needed human escalation, if there was one. Nothing else.
