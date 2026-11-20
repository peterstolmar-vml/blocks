---
title: "0101 Technology — Migration Report"
subtitle: "Complexity analysis and migration plan for 0101technology.com"
date: "November 20, 2026"
---

```{=typst}
#import "kit.typ": *
#set table(fill: (x, y) => if y == 0 { rgb("#f1f1f1") } else if calc.even(y) { rgb("#fafafa") } else { none })
```

# At a Glance

```{=typst}
#kicker[Executive summary]
#v(2pt)
#text(size: 12pt, fill: c-text)[0101technology.com is a small, hand-coded static site for a software studio. It has very little content but a lot of hand-built interaction. Five of its six pages live inside one HTML file and are switched by JavaScript, and much of the content (portfolio, FAQ answers) is stored in code rather than on the page. The overall migration complexity is]
#h(4pt) #level("medium")
#v(8pt)
#stats(
  stat("6", "Pages", sub: "from 2 HTML files", accent: s1),
  stat("2", "Templates", sub: "Studio view · Certifications", accent: s2),
  stat("7", "New blocks", sub: "+ header, footer", accent: s3),
  stat("1", "Integration", sub: "Contact form back end", accent: c-warn),
)
#v(4pt)
#callout(kind: "key", title: "Where the effort really is")[
  Moving the words is quick: about 2,500 words in total. The real work is *(1)* splitting the one-file app into real, linkable pages, *(2)* turning content stored in JavaScript into content authors can edit, *(3)* rebuilding the contact form without the site's own PHP back end, and *(4)* deciding which decorative animations to keep.
]
```

## Complexity Scorecard

```{=typst}
#table(
  columns: (28%, 18%, 1fr),
  [Dimension], [Rating], [Why],
  [Page volume], level("low"), [6 pages and about 2,500 words. Every page can be checked by hand.],
  [Template variety], level("low"), [2 layouts: the "studio" views (Home, Samples, Security, Privacy, Contact) and Certifications. Both share one look.],
  [Site architecture], level("medium"), [The five studio pages are hash views of one file (`/#security`). They must become real URLs (`/security`). Old hash links can only be redirected by a small script, because the server never sees the part after `#`.],
  [Content stored in code], level("medium"), [The 10 portfolio samples and their case studies are a JavaScript array. The 5 FAQ answers exist only as hidden structured data. Both need to become editable content.],
  [Interactive features], level("high"), [WebGL shader background (5 shaders), animated agent-mesh diagram, auto-cycling portfolio with lightbox, loading animation and "glitch" headings. All hand-written, about 54 KB of script.],
  [Forms and integrations], level("high"), [The contact form has pills, a date picker, a segmented control, a budget slider, a math CAPTCHA, a honeypot and a "thank you" dialog. It posts to the site's own `/api/contact` PHP endpoint.],
  [Media], level("low"), [10 portfolio screenshots, 7 badges, a logo and a sharing image. Images are optimised automatically after import.],
  [SEO and structured data], level("low-medium"), [`LocalBusiness` and `FAQPage` JSON-LD in the page head need a code home. The FAQ is in schema only, so Google may ignore it.],
  [Privacy and compliance], level("medium"), [The privacy policy promises "no behavioural telemetry" and first-party-only assets. Edge Delivery sends anonymous, cookie-free performance samples (RUM) by default, so the policy or the setup must change.],
  [Author change management], level("low"), [The audience is WordPress or static-site authors. A document editor with a live layout view is a small step from the WordPress block editor.],
)
```

# The Source Site

```{=typst}
#grid(columns: (1fr, 1fr), column-gutter: 8pt, row-gutter: 8pt,
  shot("img/orig-home.jpg", origin: "original", caption: [Home: hero, stats and the agent-mesh diagram]),
  shot("img/orig-portfolio.jpg", origin: "original", caption: [Samples: auto-cycling portfolio panels]),
  shot("img/orig-security.jpg", origin: "original", caption: [Security: OWASP Top 10 grid in a glass panel]),
  shot("img/orig-contact.jpg", origin: "original", caption: [Contact: details and the custom form]),
)
```

## How the Site Is Built

```{=typst}
#table(
  columns: (30%, 1fr),
  [Part], [What it is today],
  [`index.html`], [One file holding five views (`#home`, `#portfolio`, `#security`, `#privacy`, `#contact`). JavaScript hides all but one and swaps the page title.],
  [`certifications.html`], [A normal standalone page listing 7 certification badges with "Verify" links.],
  [`assets/js/site.js`], [Shader engine, view router, portfolio data and carousel, lightbox, form logic, date picker.],
  [`assets/css/site.css`], [About 660 lines. Navy and cyan design tokens, two self-hosted fonts (Space Grotesk and JetBrains Mono).],
  [`submit.php` / `/api/contact`], [The server-side form handler. It is blocked in `robots.txt`.],
  [`sitemap.xml`], [Only two URLs: `/` and `/certifications.html`. The other four views are not indexed on their own.],
)
```

## Page Inventory and New Addresses

| Source | What is on it | New page |
|:---|:---|:---|
| `/#home` | Eyebrow, headline, intro, 2 buttons, 3 stats, agent-mesh diagram | `/0101/` |
| `/#portfolio` | Intro panel, 2 buttons, 10 portfolio samples (2 with case studies), contact button | `/0101/samples` |
| `/#security` | Headline, intro with OWASP link, 10-item OWASP grid, Privacy by Design panel, 2 buttons | `/0101/security` |
| `/#privacy` | Privacy policy: 10 text panels, last-updated date | `/0101/privacy` |
| `/#contact` | Headline, intro, 4 contact details, contact form | `/0101/contact` |
| `/certifications.html` | 2 issuer groups, 7 badge cards, legal note, 2 buttons | `/0101/certifications` |
| Header, footer | Logo, 6 numbered links, Play/Pause motion toggle; copyright, 2 links, badge strip | `/0101/nav`, `/0101/footer` |

```{=typst}
#callout(kind: "note", title: "Why /0101/?")[This Edge Delivery project already hosts other demo pages at its root. The 0101 pages live under `/0101/` with their own navigation, footer and theme, so nothing existing changes. Moving them to the root of a dedicated 0101 site later is a copy plus a find-and-replace on `/0101/` links.]
```

# Content Model

Each piece of the source maps to something an author types in a document. The default is plain text. Blocks are used only where the layout or behaviour needs them.

```{=typst}
#table(
  columns: (27%, 25%, 1fr, 13%),
  [Source element], [Becomes], [What authors fill in], [Authoring],
  [Eyebrow, headline, intro, buttons], [Default content], [A short line above the heading, a Heading 1 (italic words turn cyan), paragraphs, bold or italic links for buttons], level("low"),
  [Home stats], [*Stats* block], [One row per stat: `SHIP/fast` · label], level("low"),
  [Agent-mesh diagram], [*Agent Mesh* block], [A title row, then one row per metric. The diagram itself is drawn by code.], level("low"),
  [Portfolio carousel], [*Showcase* block], [One row per sample: image · title · type · optional case study], level("low"),
  [OWASP grid], [*Feature Grid* block], [One row per item: code · title · description], level("low"),
  [Glass panels], [Section style `glass`], [A Section Metadata table with `style: glass`], level("low"),
  [Contact details], [*Facts* block], [One row per detail: label · value], level("low"),
  [Contact form], [*Contact Form* block], [Settings rows: where to send, interest options, stages, button text], level("medium"),
  [Certification cards], [*Certifications* block], [One row per badge: badge image · title, issuer, dates, Verify link], level("low"),
  [Header and footer], [`nav` and `footer` documents], [Logo plus a list of links; copyright line and badge strip], level("low"),
  [Page title, description, sharing image], [*Metadata* table], [At the end of each document], level("low"),
)
```

# Complexity Drivers

```{=typst}
#compare(
  ltitle: "What makes it easy",
  rtitle: "What needs attention",
  [
    - Very little content: 6 pages, about 2,500 words
    - One consistent visual language (navy, cyan, two fonts)
    - Clean, semantic, accessible source markup with alt text everywhere
    - No CMS, plugins, user accounts, commerce or tracking to migrate
    - Mostly text pages (Security, Privacy) that map directly to documents
  ],
  [
    - *Hash routing:* 5 views in one file become 5 URLs
    - *Content in code:* portfolio data and FAQ answers must be extracted
    - *Contact form:* Edge Delivery has no PHP. The form needs an endpoint that accepts cross-origin posts, or a forms service.
    - *Decorative script:* WebGL shaders and animations must be rebuilt as blocks, or dropped
    - *Privacy promises:* RUM sampling conflicts with the policy wording
  ],
)
```

## Decisions Taken in This Migration

```{=typst}
#table(
  columns: (26%, 1fr),
  [Topic], [Decision and reason],
  [Page addresses], [Each view becomes its own page. Links such as `index.html#security` are rewritten to `/0101/security` during import.],
  [Shader background], [Replaced by a static navy gradient with a faint grid and grain. The WebGL engine is about 30 KB of script and runs on every page, and it is paused by default in the source. It can be added back later as a delayed-loaded enhancement.],
  [Agent-mesh diagram], [Kept as a block. The diagram is drawn by code and animated with CSS; authors edit only the title and metrics.],
  [Portfolio], [The auto-cycling stage becomes a responsive grid with a lightbox. Content (images, titles, types, case studies) is now authored in the document.],
  [Contact form], [A custom block that keeps every field and the CAPTCHA and honeypot. It sends JSON to an endpoint set by the author (defaults to the existing `/api/contact`). The back end must allow cross-origin requests from the new domain.],
  [Glitch headings], [Highlighted words become italic text in the heading, shown in cyan. No animation.],
  [Loader and motion toggle], [Dropped. Nothing to animate once the shader is gone.],
  [Fonts], [The same self-hosted Space Grotesk and JetBrains Mono files, copied into the project and served from the same domain as the site.],
  [Images], [The source server sends `Cross-Origin-Resource-Policy: same-origin`, so its images can't be shown from another domain. All 19 images are copied into the project's media folder during import and travel with the pages when they are uploaded.],
  [Theme scope], [The 0101 look is a separate stylesheet. It loads only on pages whose Metadata says `Template: studio-0101`, so the other pages in this project are unaffected.],
  [Section styles], [This project's core scripts didn't apply Section Metadata. Support was added to the page scripts, so `glass`, `narrow`, `split`, `center` and `legal` work on any page.],
)
```

## Risk Register

```{=typst}
#table(
  columns: (26%, 13%, 1fr),
  [Risk], [Level], [Mitigation],
  [Contact form stops working after go-live], level("high"), [Add the new domain to the back end's CORS allow-list, or point the block at a forms service. Test a real submission on the preview site before switching DNS.],
  [Old hash links (`/#contact`) land on the home page], level("medium"), [A small script on the home page maps `#portfolio`, `#security`, `#privacy` and `#contact` to the new pages. Update links you share yourself, such as email signatures and profiles.],
  [Privacy policy no longer accurate], level("medium"), [Either reword the "no behavioural telemetry" sentence to mention anonymous performance sampling, or turn RUM off in the project code. Decide before go-live.],
  [FAQ structured data has no visible content], level("low-medium"), [Add the 5 FAQ questions as a visible section (for example on Contact) and generate the JSON-LD from it.],
  [Loss of visual "wow" without shaders], level("low"), [The static background keeps the palette and grid. Re-introduce one shader as a delayed enhancement if wanted.],
  [Visual differences from the original], level("low"), [Side-by-side check of each page against the source before review.],
)
```

# Where the Migration Stands

```{=typst}
#meter(6, 6, "Pages imported into the workspace", color: s1)
#v(4pt)
#meter(7, 7, "Custom blocks built and styled", color: s2)
#v(4pt)
#meter(2, 2, "Site-wide documents (nav, footer)", color: s3)
#v(8pt)
#grid(columns: (1fr, 1fr), column-gutter: 8pt,
  callout(kind: "good", title: "Done")[
    - Import scripts for both templates, which can be re-run
    - All 6 pages plus `nav` and `footer` imported under `/0101/`
    - 7 blocks, the scoped 0101 theme and self-hosted fonts
    - Internal links rewritten to the new addresses
  ],
  callout(kind: "warn", title: "Still open")[
    - Contact back end: CORS for the new domain
    - Privacy policy versus RUM decision
    - Hash-link redirect script (only needed once 0101 moves to its own domain)
    - Visible FAQ section and JSON-LD
    - Upload to Experience Workspace, preview and publish
  ],
)
```

# Plan and Effort

```{=typst}
#steps(
  ("Import", "6 pages, nav, footer"),
  ("Blocks and theme", "7 blocks, fonts, styles"),
  ("Form back end", "CORS or forms service"),
  ("Visual QA", "Compare every page"),
  ("Author enablement", "Guide and a walkthrough"),
  ("Go live", "Upload, preview, publish, DNS"),
)
#v(8pt)
#table(
  columns: (34%, 1fr, 18%),
  [Work package], [Scope], [Rough effort\*],
  [Content import], [Import scripts for both templates, link rewriting, nav and footer], [0.5 day],
  [Blocks and theme], [Stats, Agent Mesh, Showcase, Feature Grid, Facts, Contact Form, Certifications; header, footer and section styles], [1.5–2 days],
  [Form back end], [CORS on `/api/contact` or a move to a forms service; end-to-end test], [0.5 day],
  [Compliance and SEO], [Privacy wording or RUM decision, JSON-LD, visible FAQ, redirects], [0.5 day],
  [Visual QA], [Desktop and mobile comparison of all 6 pages], [0.5 day],
  [Author enablement], [Author Guide, Library set-up, a 1-hour walkthrough], [0.5–1 day],
  [*Total*], [], [*4–5 days*],
)
#text(size: 7.5pt, fill: c-muted)[\* Rough planning estimates for one person who knows Edge Delivery Services. Not a quote. Optional shader re-introduction: add 1 day.]
```

# Moving Authors from WordPress or Hand-Written HTML

The full walkthrough is in the companion **0101 Technology — Author Guide**. The short version:

```{=typst}
#table(
  columns: (38%, 1fr),
  [Before], [On this site],
  [Editing `index.html` in a code editor and uploading by FTP or Git], [Editing a document in the browser. Preview and Publish take it live, with no build or deploy step.],
  [WordPress block editor (Gutenberg) blocks], [Blocks are tables: the first row names the block, the cells hold its content],
  [WordPress Group block and its background colour], [A section (between horizontal rules) with a *Section Metadata* style],
  [Yoast or page settings: SEO title and description], [A *Metadata* table at the end of the document],
  [Menus screen (Appearance → Menus)], [The `nav` document: a bulleted list of links],
  [Footer widgets or a footer template part], [The `footer` document],
  [Media Library], [Drag images into the document. They are stored next to it and optimised automatically.],
  [Draft, Preview, Publish], [The same three ideas: edit, *Preview* (`.aem.page`), *Publish* (`.aem.live`)],
  [Revisions], [Version history in Experience Workspace],
  [Contact Form 7 or a PHP mailer], [The *Contact Form* block. Its settings are rows in a table.],
)
#v(6pt)
#grid(columns: (1fr, 1fr), column-gutter: 8pt,
  callout(kind: "tip", title: "WordPress authors")[Usually productive in an hour. The layout view in Experience Workspace feels like the block editor, and the content view shows what is really stored.],
  callout(kind: "tip", title: "Hand-coded HTML authors")[You no longer touch HTML, CSS or script to change words or images. Design changes still go through the developer and Git.],
)
```

# Appendix — Source Assets

| Asset | Count | Notes |
|:---|:---|:---|
| Portfolio screenshots | 10 | PNG plus WebP pairs under `/images/`. They are imported as images and optimised automatically. |
| Certification badges | 7 | PNG under `/images/badges/`, reused in the footer strip |
| Logo | 1 | `assets/logo/0101-logo-dark.svg` |
| Sharing image | 1 | `images/og-card.png`, set in each page's Metadata |
| Fonts | 2 | `space-grotesk-latin.woff2`, `jetbrains-mono-latin.woff2` (both under the SIL Open Font License) |
| Structured data | 2 | `LocalBusiness` / `ProfessionalService` and `FAQPage` JSON-LD |
