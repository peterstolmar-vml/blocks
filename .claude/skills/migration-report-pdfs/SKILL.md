---
name: migration-report-pdfs
description: Produce the two human-readable PDF deliverables for a site migration — the Migration Report (complexity analysis and plan) and the Author Guide — and expose them in the preview the same way as every earlier report. Use whenever the user asks for a migration report, complexity report, authoring guide, author guide, handover PDFs, or "the reports" for a migrated site.
---

# Migration Report and Author Guide PDFs

Every migration gets the same two PDFs, built the same way and delivered the same way. Do this on the
**first** request: don't invent a different layout or delivery.

## 1. Write the sources in `migrate/<site>/`

| File | Content |
|:---|:---|
| `MIGRATION-REPORT.md` | Front matter `title`, `subtitle`, `date`. Sections: At a Glance (stat tiles, overall level), Complexity Scorecard, The Source Site (original screenshots), Page Inventory and New Addresses, Content Model, Complexity Drivers, Decisions Taken, Risk Register, Where the Migration Stands (meters, done / still open), Plan and Effort, Moving Authors (old tool → Experience Workspace), Appendix. |
| `AUTHOR-GUIDE.md` | Front matter as above. Sections: Quick Reference (real org/site links), What Changes for You (written for the authors' previous tool), A Tour of Experience Workspace, Getting Started, Anatomy of a Page, Writing Text / Buttons, Sections and Section Styles, Block Reference (one card per block with a preview screenshot and a doctable), Navigation and Footer, Page Metadata and Images, Preview and Publish, Working with the AI Assistant, Help and Support. |
| `img/` | `orig-*.jpg` from the source site, `prev-*.jpg`, `blk-*.jpg` and `sec-*.jpg` from the migrated preview (Playwright element screenshots). |
| `kit.typ` | Copied automatically from this skill if missing. Components: `stat`, `stats`, `level`, `callout`, `meter`, `segbar`, `hbars`, `compare`, `steps`, `swatch`, `shot`, `doctable`, `ph`, `blockhead`, `pill`, `kicker`. |

Start each `.md` with the same typst preamble used in `migrate/0101/*.md`. Reuse `migrate/0101/` as the
worked example.

## 2. Build and publish in one step

```bash
.claude/skills/migration-report-pdfs/scripts/publish-reports.sh migrate/<site> <prefix>
```

This builds `migrate/<site>/out/{MIGRATION-REPORT,AUTHOR-GUIDE}.pdf` (Adobe whitepaper template from the
project-management plugin) and writes, at the **content root**:

- `content/<prefix>-MIGRATION-REPORT.pdf` and `content/<prefix>-MIGRATION-REPORT.html`
- `content/<prefix>-AUTHOR-GUIDE.pdf` and `content/<prefix>-AUTHOR-GUIDE.html`

Each `.html` is a `<body><main>` download page (title, summary, contents, `<a href="./<prefix>-<NAME>.pdf">`).
This capitalised `.html` + `.pdf` pair at the content root is exactly how the WKND reports
(`content/MIGRATION-GUIDE.*`, `content/AUTHOR-GUIDE.*`) were delivered, and it is what the platform syncs.

## 3. Check, then tell the user

1. Check the PDFs render (`./build.sh NAME png` in the folder makes page contact sheets) and that
   `http://localhost:3000/content/<prefix>-<NAME>.pdf` returns `application/pdf`.
2. Tell the user, in one or two lines, that the two reports are in the preview's content list as
   `<prefix>-MIGRATION-REPORT` and `<prefix>-AUTHOR-GUIDE`, each with a Download link.

## Don't

- Don't leave the PDFs only in `migrate/…/out/` or put them in a subfolder: the preview won't show them.
- Don't create lowercase `content/<prefix>-<name>.plain.html` pages for the reports; the sync writes those.
- Don't give the user workspace file paths or localhost links as "download links", and don't send them
  navigation steps.
- Don't upload to DA or preview/publish on EDS unless the user explicitly asks in that message.
