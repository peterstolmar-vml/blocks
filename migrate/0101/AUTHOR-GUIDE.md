---
title: "0101 Technology — Author Guide"
subtitle: "Editing the site in Experience Workspace, for WordPress and static-site authors"
date: "November 20, 2026"
---

```{=typst}
#import "kit.typ": *
#set table(fill: (x, y) => if y == 0 { rgb("#f1f1f1") } else if calc.even(y) { rgb("#fafafa") } else { none })
```

# Quick Reference

```{=typst}
#kicker[Your bookmarks]
#v(2pt)
#text(size: 11pt)[Everything you need day to day. The 0101 pages live in the `/0101/` folder of the *blocks* site in the *peterstolmar-vml* organisation.]
#v(6pt)
```

| What | Where |
|:---|:---|
| **Edit content** (Experience Workspace) | `https://da.live/#/peterstolmar-vml/blocks/0101` |
| **Preview** (check before going live) | `https://main--blocks--peterstolmar-vml.aem.page/0101/` |
| **Live site** | `https://main--blocks--peterstolmar-vml.aem.live/0101/` (or your own domain) |
| **Experience Workspace docs** | `https://www.aem.live/docs/ew/authoring` |
| **Bulk preview and publish** | **Apps → Bulk** in Experience Workspace |

```{=typst}
#v(6pt)
#grid(columns: (1fr, 1fr, 1fr), column-gutter: 8pt,
  stat("7", "Blocks", sub: "Stats · Agent Mesh · Showcase · Feature Grid · Facts · Contact Form · Certifications", accent: s1),
  stat("5", "Section styles", sub: "glass · narrow · split · center · legal", accent: s2),
  stat("8", "Documents", sub: "6 pages + nav + footer", accent: s3),
)
#v(6pt)
#callout(kind: "key", title: "The one-sentence version")[
  You write pages as *documents* in the browser. Normal text is normal text, a *table* whose first row names a block becomes a component, a *horizontal rule* starts a new section, and a *Metadata* table at the end holds the SEO title and description. *Preview* to check, *Publish* to go live. There is no FTP, no build step and no plugin to update.
]
```

# What Changes for You

You may be coming from WordPress, where you edit in the block editor and publish from the dashboard. Or you may be coming from a hand-coded site like the old 0101technology.com, where a change meant opening `index.html` in a code editor and uploading it. Either way, Experience Workspace will feel familiar. It is a document editor with a live visual view, and every page is one document.

```{=typst}
#compare(
  [
    1. Log in to `/wp-admin` *or* open `index.html` in a code editor
    2. Add a block in the block editor *or* copy and paste an HTML snippet
    3. Fill in the block's settings in the sidebar *or* edit attributes and classes
    4. Set the SEO title in Yoast *or* edit the `<title>` and `<meta>` tags
    5. Preview the draft *or* open the file locally
    6. Click Publish *or* upload by FTP or Git and wait for a deploy
  ],
  [
    1. Open the page in Experience Workspace
    2. Insert a block from the *Library*, or type its table
    3. Fill in the table cells. They *are* the block's settings.
    4. Fill in the *Metadata* table at the end of the document
    5. Switch to *Layout* view, or *Preview* to see the real page
    6. *Publish*. The page is live in seconds, with no deploy.
  ],
)
```

## Six Ideas to Learn

```{=typst}
#let idea(n, title, body) = block(width: 100%, inset: 9pt, radius: 6pt, fill: c-soft, breakable: false, {
  grid(columns: (22pt, 1fr), column-gutter: 6pt,
    box(width: 20pt, height: 20pt, radius: 10pt, fill: c-red, align(center + horizon, text(size: 10pt, weight: "black", fill: white, str(n)))),
    { text(size: 10pt, weight: "bold", fill: c-ink, title); linebreak(); set par(justify: false); text(size: 8.5pt, body) })
})
#grid(columns: (1fr, 1fr), column-gutter: 8pt, row-gutter: 8pt,
  idea(1, "A table is a block", [Like a Gutenberg block. The first row is the block name; the cells below are its content and settings, in a fixed order.]),
  idea(2, "A horizontal rule is a new section", [Like a WordPress Group block, or a new `<section>` in HTML. Type `---` to start one.]),
  idea(3, "Section Metadata styles the section", [A small table inside a section sets its look, such as a glass panel or a narrow column. It plays the role of the Group block's colour and width settings, or a CSS class.]),
  idea(4, "Metadata replaces SEO settings", [A table at the very end of the document sets the title, description and sharing image. It does the job of Yoast, or of the `<head>` tags.]),
  idea(5, "Formatting makes buttons", [Bold link = primary button, italic link = secondary button. There is no Button block.]),
  idea(6, "You never touch code", [Colours, fonts, spacing and behaviour come from the project code. You change words, images and order; a developer changes design.]),
)
```

## Concept Map

| In WordPress | In a static HTML site | In Experience Workspace |
|:---|:---|:---|
| Pages screen | Folder of `.html` files | The content browser at `da.live/#/peterstolmar-vml/blocks/0101` |
| Add New Page | Copy an existing `.html` file | **New → Page**, then copy content from a similar page |
| Block editor | Code editor | Document editor with **Layout**, **Content** and **Split** views |
| Gutenberg block plus sidebar settings | HTML snippet plus classes | A block table: name in row 1, content and settings in the cells |
| Group block, colour and width | `<section class="…">` | A section between `---` rules, styled by **Section Metadata** |
| Buttons block | `<a class="btn primary">` | A **bold** or *italic* link on its own line |
| Yoast SEO title and description | `<title>`, `<meta name="description">` | The **Metadata** table at the end of the page |
| Appearance → Menus | The `<nav>` copied into every file | The `nav` document, edited once |
| Footer widgets | The `<footer>` copied into every file | The `footer` document, edited once |
| Media Library | `/images/` folder | Drag images into the document. They are stored next to it and optimised automatically. |
| Contact Form 7 | `<form>` plus `submit.php` | The **Contact Form** block |
| Preview draft | Open the file locally | **Preview** (`.aem.page`) |
| Publish / Update | FTP upload or Git push | **Publish** (`.aem.live`) |
| Revisions | Git history | **Versions** in the tools panel |
| Comments plugin, Slack threads | Email | **Comments** in the tools panel |
| Plugins and theme updates | Library upgrades | None. The platform is managed for you. |

```{=typst}
#callout(kind: "warn", title: "What you no longer do")[
  You don't edit HTML, CSS or JavaScript, install plugins, or upload files by FTP. If something looks wrong, such as a colour, spacing or how a block behaves, it is a code change. Tell the developer; don't try to fix it with formatting.
]
```

# A Tour of Experience Workspace

Experience Workspace is the new name for Document Authoring (`da.live`). It runs in the browser, saves as you type, and lets several people (and the AI assistant) edit the same page at the same time.

```{=typst}
#table(
  columns: (24%, 1fr),
  [Area], [What it does],
  [*Content browser*], [The folder view. Breadcrumbs at the top, a search field that can also search and replace, and checkboxes to select pages for preview, publish or copy.],
  [*Content editor* (centre)], [Where you edit the page. Three tabs: *Layout* (looks like the real page, WYSIWYG), *Content* (the underlying document with block tables, the most precise view), and *Split* (both side by side).],
  [*Assistant panel* (left)], [An AI assistant you can ask in plain language, for example "shorten this paragraph" or "add an FAQ section". It asks before it changes anything.],
  [*Tools panel* (right)], [*Outline* (sections on this page), *Page* (page metadata), *Files* (other documents in the project), *Versions* (history, compare and restore), *Comments*, and *Preflight* (quality checks before publishing).],
  [*Send menu* (top bar)], [*Preview* or *Preview & Publish*. The icon gets an orange badge when you have previewed changes that are not yet published.],
)
```

```{=typst}
#callout(kind: "tip", title: "Which view should I use?")[
  Use *Layout* for writing and quick text changes, because it looks like the site. Switch to *Content* when you work with block tables or section breaks: there you can see exactly which cell you are in. *Split* is handy while you learn.
]
#v(4pt)
#callout(kind: "note", title: "Two editors, one site")[
  If the address bar shows `/edit` rather than `/canvas`, you are in the earlier *document editor*. It has no Layout view. Use its *Preview* tab on the right for a live view instead. Everything in this guide works in both editors.
]
```

# Getting Started

## Before You Begin

```{=typst}
#let check(body) = [#box(width: 9pt, height: 9pt, radius: 2pt, stroke: 0.8pt + c-muted, baseline: 10%) #h(4pt) #body \ ]
#block(inset: 10pt, radius: 6pt, fill: c-soft, width: 100%, {
  check[An Adobe account with access to the *peterstolmar-vml / blocks* site (ask the site administrator)]
  check[Permission to preview and publish]
  check[Optional: the *AEM Sidekick* browser extension, which adds Preview and Publish buttons when you view the site]
  check[This guide's Quick Reference links bookmarked]
})
```

## Your First Edit in Five Steps

```{=typst}
#steps(
  ("Open", "da.live/#/peterstolmar-vml/blocks/0101"),
  ("Pick a page", "e.g. contact"),
  ("Edit", "Type in Layout view"),
  ("Preview", "Send → Preview"),
  ("Publish", "Send → Preview & Publish"),
)
#v(8pt)
#callout(kind: "tip", title: "Page addresses come from document names")[
  A document named `security` in the `0101` folder becomes `/0101/security`. The document called `index` is the folder's home page (`/0101/`). Use lowercase words with hyphens, and avoid spaces and special characters. Renaming a document changes its address, so tell whoever links to it.
]
```

## How the 0101 Folder Is Organised

| Document | Page | What it holds |
|:---|:---|:---|
| `index` | `/0101/` | Home: headline, intro, buttons, stats and the agent-mesh diagram |
| `samples` | `/0101/samples` | Portfolio: intro panel and the Showcase grid |
| `security` | `/0101/security` | OWASP Top 10 grid and Privacy by Design |
| `privacy` | `/0101/privacy` | Privacy policy, one glass panel per topic |
| `contact` | `/0101/contact` | Contact details and the contact form |
| `certifications` | `/0101/certifications` | Badge cards grouped by issuer, plus the legal note |
| `nav` | (every page) | Logo and the six menu links |
| `footer` | (every page) | Copyright line and the badge strip |

# Anatomy of a Page

Every 0101 page is built from the same five parts. This is the Security page in *Content* view, shortened.

```{=typst}
#let note(n, body) = grid(columns: (16pt, 1fr), column-gutter: 4pt,
  box(width: 14pt, height: 14pt, radius: 7pt, fill: c-red, align(center + horizon, text(size: 7.5pt, weight: "bold", fill: white, str(n)))),
  { set par(justify: false); text(size: 8.5pt, body) })
#let marker(n) = box(width: 12pt, height: 12pt, radius: 6pt, fill: c-red, baseline: 20%, align(center + horizon, text(size: 7pt, weight: "bold", fill: white, str(n))))

#grid(columns: (58%, 1fr), column-gutter: 12pt,
  block(width: 100%, inset: 12pt, radius: 6pt, stroke: 0.6pt + c-line, fill: white, {
    text(size: 7pt, fill: c-muted)[DOCUMENT · /0101/security]
    v(2pt)
    marker(1); h(4pt); text(size: 8pt, fill: c-muted)[Security Practices]
    linebreak()
    text(size: 14pt, weight: "bold")[Security by _design._]
    v(-2pt)
    text(size: 8.5pt)[We integrate security at every layer…]
    v(2pt)
    marker(3)
    doctable("Section Metadata", (("style", "narrow"),))
    v(2pt)
    marker(4); h(4pt); text(size: 9pt, fill: c-muted)[`---`  (next section starts here)]
    v(4pt)
    text(size: 10pt, weight: "bold")[OWASP Top 10 (2025) — What we prevent]
    v(-2pt)
    marker(2)
    doctable("Feature Grid", ((ph[A01:2025], ph[Broken Access Control], ph[Role-based access…]),))
    doctable("Section Metadata", (("style", "glass, narrow"),))
    v(4pt)
    text(size: 8.5pt, fill: c-muted)[… more sections …]
    v(4pt)
    marker(5)
    doctable("Metadata", (("Title", "Security Practices — 0101 Technology"), ("Description", "Security by design…"), ("Template", "studio-0101"), ("nav", "nav"), ("footer", "footer")))
  }),
  {
    note(1)[*Default content.* Eyebrow line, heading, paragraphs, lists and links. Just type, as in any editor.]
    v(6pt)
    note(2)[*A block.* A table whose first row is the block name. Here, the Feature Grid.]
    v(6pt)
    note(3)[*Section Metadata.* Styles the section it sits in. `narrow` keeps the text column readable.]
    v(6pt)
    note(4)[*Section break.* A horizontal rule ends one section and starts the next.]
    v(6pt)
    note(5)[*Page Metadata.* Always at the very end. Keep `Template`, `nav` and `footer` exactly as they are: they give the page the 0101 look, menu and footer.]
  },
)
```

# Writing Text

Most of a 0101 page is plain text. The theme turns a few simple patterns into the studio look:

```{=typst}
#table(
  columns: (32%, 30%, 1fr),
  [You type], [You get], [Tips],
  [A short line just *above* the Heading 1], [The cyan, spaced-out *eyebrow* with a line in front], [Keep it to a few words, such as "Security Practices"],
  [Heading 1 with some words in _italic_], [White headline with the italic words in bold cyan], [One Heading 1 per page. Italicise only the last word or two, like "Security by _design._"],
  [The first paragraph after the heading], [The larger *lede* paragraph], [One or two sentences],
  [Heading 2 inside a glass section], [The cyan panel title], [One per panel],
  [Shift + Enter inside a heading], [A line break in the headline], [As in "Production software, / fast."],
)
```

## Buttons and Links

You don't pick a button component. The formatting of a link on its own line decides how it looks.

```{=typst}
#let btn(label, fill, ink, stroke-c) = box(inset: (x: 10pt, y: 6pt), fill: fill, stroke: if stroke-c != none { 1pt + stroke-c } else { none },
  text(size: 7.5pt, weight: "bold", tracking: 0.12em, fill: ink, upper(label) + " →"))
#table(
  columns: (32%, 30%, 1fr),
  [You type], [You get], [Use for],
  [*#underline[Start a Project]* (bold link, alone on its line)], btn("Start a Project", c-forest, white, rgb("#3dd9ff")), [The main action],
  [_#underline[View Work]_ (italic link, alone on its line)], btn("View Work", c-forest, rgb("#9fb8d6"), rgb("#9fb8d6")), [A second, quieter action],
  [*_#underline[Book a call]_* (bold + italic link)], btn("Book a call", rgb("#3dd9ff"), c-forest, none), [A rare, high-impact call to action],
  [A link inside a sentence], [A normal underlined cyan link], [References, email addresses],
)
#v(4pt)
#shot("img/buttons.jpg", caption: [Two buttons: a bold link and an italic link, each on its own line])
```

```{=typst}
#callout(kind: "tip", title: "Linking to other 0101 pages")[
  Link with the page path, for example `/0101/contact`. Links to other sites open in the same tab unless the block says otherwise. The Certifications block opens its Verify links in a new tab by itself.
]
```

# Sections and Section Styles

A section is everything between two horizontal rules. To style it, add a **Section Metadata** table inside it, usually at the end, with a `style` row. You can combine styles with commas.

```{=typst}
#table(
  columns: (18%, 1fr, 30%),
  [Style], [What it does], [Used on],
  [`glass`], [A framed, translucent panel with cyan corner marks], [Samples intro, Security and Privacy panels],
  [`narrow`], [Limits the width to about 840 px for comfortable reading], [Security, Privacy, Certifications],
  [`split`], [Two columns on desktop: the text on the left, the section's *last block* on the right. Stacks on phones.], [Home (diagram), Contact (form)],
  [`center`], [Centres text and buttons], [Button rows at the end of pages],
  [`legal`], [A small-print panel with muted text], [The note on Certifications],
)
#v(6pt)
#grid(columns: (1fr, 1fr), column-gutter: 10pt,
  shot("img/sec-glass.jpg", caption: [`glass, narrow`: one privacy-policy topic]),
  shot("img/sec-legal.jpg", caption: [`legal, narrow`: the badge disclaimer]),
)
#v(6pt)
#shot("img/sec-split.jpg", caption: [`split` on the home page: the text and the Stats block on the left, Agent Mesh (the last block) on the right])
```

```{=typst}
#callout(kind: "warn", title: "split depends on order")[
  In a `split` section the *last* block always goes to the right-hand column. On the Home page that is Agent Mesh; on Contact it is the Contact Form. If you add another block, put it *before* that one.
]
```

# Block Reference

Each card shows what the block looks like, how to type it, and what it replaces from WordPress or the old HTML. *Grey italic text* in the tables is sample content. The easiest way to add a block is to copy an existing one from another page, then change its content.

```{=typst}
#callout(kind: "key", title: "The golden rule for every block")[
  Keep the *first row* (the block name) exactly as it is, and keep the *order of the columns*. Add or remove whole *rows* to add or remove items.
]
```

```{=typst}
#block(breakable: false, width: 100%)[
#heading(level: 2)[Stats]
#blockhead("Stats", "Stats", "low", "Home", "Columns block with big numbers")
#v(6pt)
#shot("img/blk-stats.jpg", caption: [Three stats under the home-page buttons])
#v(4pt)
#grid(columns: (55%, 1fr), column-gutter: 10pt,
  doctable("Stats", (
    (ph[SHIP/fast], ph[Compressed delivery]),
    (ph[ALL/platforms], ph[Desktop · Web · Mobile · XR]),
    (ph[PROD/ready], ph[Ship target, every release]),
  ), caption: [One row per stat: value | label]),
  {
    text(size: 9pt, weight: "bold")[How to fill it in]
    v(-2pt)
    set text(size: 8.5pt); set par(justify: false)
    [- The text *before the slash* turns cyan
    - Keep values short, two words at most
    - Three stats fit side by side; more wrap onto a new line]
  },
)
]
#v(10pt)
```

```{=typst}
#block(breakable: false, width: 100%)[
#heading(level: 2)[Agent Mesh]
#blockhead("Agent Mesh", "Agent Mesh", "low", "Home", "A custom HTML/SVG widget")
#v(6pt)
#grid(columns: (38%, 1fr), column-gutter: 10pt,
  shot("img/blk-agent-mesh.jpg", caption: [The diagram panel]),
  {
    doctable("Agent Mesh", (
      (ph[Agent Mesh], ph[JSON-RPC · Demo]),
      (ph[Throughput], ph[1,284 rpc/s]),
      (ph[Mean latency], ph[3.1µs]),
      (ph[Lossy frames], ph[0 / 10,000]),
    ), caption: [Row 1 = title | tag line · then one row per metric])
    v(4pt)
    set text(size: 8.5pt); set par(justify: false)
    [- The diagram, its animation and the scrolling activity log are drawn by code. You edit only the title and metrics.
    - The animation stops for visitors who have asked their device for reduced motion.
    - It is decorative and illustrative, not live data.]
  },
)
]
#v(10pt)
```

```{=typst}
#block(breakable: false, width: 100%)[
#heading(level: 2)[Showcase]
#blockhead("Showcase", "Showcase", "low", "Samples", "Gallery block or a portfolio plugin")
#v(6pt)
#shot("img/blk-showcase.jpg", caption: [Numbered sample cards. Selecting one opens a full-size lightbox.])
#v(4pt)
#grid(columns: (60%, 1fr), column-gutter: 10pt,
  doctable("Showcase", (
    (ph[screenshot], ph[Command Centre], ph[Dashboard], ""),
    (ph[screenshot], ph[muLLM Router], ph[AI / LLM], ph[muLLM routes queries across local…]),
  ), caption: [One row per sample: image | title | type | case study (optional)]),
  {
    text(size: 9pt, weight: "bold")[How to fill it in]
    v(-2pt)
    set text(size: 8.5pt); set par(justify: false)
    [- Numbers (01, 02…) are added automatically in row order
    - Reorder rows to reorder samples
    - The case study appears only in the lightbox. Leave the cell empty if there is none.
    - Always set the image's *alt text*: it describes the screenshot to screen readers]
  },
)
]
#v(10pt)
```

```{=typst}
#block(breakable: false, width: 100%)[
#heading(level: 2)[Feature Grid]
#blockhead("Feature Grid", "Feature Grid", "low", "Security", "A Columns block or an HTML <div> grid")
#v(6pt)
#shot("img/blk-feature-grid.jpg", caption: [The OWASP Top 10 grid inside a glass section])
#v(4pt)
#grid(columns: (60%, 1fr), column-gutter: 10pt,
  doctable("Feature Grid", (
    (ph[A01:2025], ph[Broken Access Control], ph[Role-based access, least-privilege defaults…]),
    (ph[A02:2025], ph[Security Misconfiguration], ph[Infrastructure-as-code, hardened defaults…]),
  ), caption: [One row per item: code | title | description]),
  {
    text(size: 9pt, weight: "bold")[How to fill it in]
    v(-2pt)
    set text(size: 8.5pt); set par(justify: false)
    [- The code is optional. With only two columns, they are read as title | description.
    - Reusable for any list of features, principles or services]
  },
)
]
#v(10pt)
```

```{=typst}
#block(breakable: false, width: 100%)[
#heading(level: 2)[Facts]
#blockhead("Facts", "Facts", "low", "Contact", "A definition list or a two-column table")
#v(6pt)
#grid(columns: (45%, 1fr), column-gutter: 10pt,
  shot("img/blk-facts.jpg", caption: [Contact details]),
  {
    doctable("Facts", (
      (ph[Email], underline(ph[peter\@0101technology.com])),
      (ph[Hours], ph[Mon–Fri · 08–20 PT]),
      (ph[Location], ph[Oregon, USA]),
      (ph[Status], ph[Accepting new projects]),
    ), caption: [One row per detail: label | value])
    v(2pt)
    set text(size: 8.5pt); set par(justify: false)
    [Values can contain links, such as a `mailto:` email link. Change *Status* when you stop taking new projects.]
  },
)
]
#v(10pt)
```

```{=typst}
#block(breakable: false, width: 100%)[
#heading(level: 2)[Contact Form]
#blockhead("Contact Form", "Contact Form", "medium", "Contact", "Contact Form 7, or <form> plus submit.php")
#v(6pt)
#grid(columns: (36%, 1fr), column-gutter: 10pt,
  shot("img/blk-contact-form.jpg", caption: [The enquiry form]),
  {
    doctable("Contact Form", (
      (ph[Send to], ph[https://0101technology.com/api/contact]),
      (ph[Interests], [#ph[• ◇ Custom Code] \ #ph[• ✦ Save Tokens] \ #ph[• …]]),
      (ph[Stages], [#ph[• Scoping] \ #ph[• Building] \ #ph[• Running]]),
      (ph[Budget max (k USD)], ph[500]),
      (ph[Button], ph[Send message]),
      (ph[Thank-you heading], ph[Message received.]),
      (ph[Thank-you text], ph[Thank you. We reply to every enquiry…]),
      (ph[Fallback email], ph[peter\@0101technology.com]),
    ), caption: [Settings rows: setting | value. Keep the left column exactly as written.])
    v(2pt)
    set text(size: 8.5pt); set par(justify: false)
    [- The fields (name, email, organisation, interests, start date, stage, budget, message, security check) are fixed in code
    - *Interests* and *Stages* are bulleted lists. Add, remove or reorder items freely.
    - Only change *Send to* together with the developer: the receiving server must accept messages from this site]
  },
)
]
#v(10pt)
```

```{=typst}
#block(breakable: false, width: 100%)[
#heading(level: 2)[Certifications]
#blockhead("Certifications", "Certifications", "low", "Certifications", "A Media & Text block per badge")
#v(6pt)
#shot("img/blk-certifications.jpg", caption: [Badge cards with Verify buttons])
#v(4pt)
#grid(columns: (55%, 1fr), column-gutter: 10pt,
  doctable("Certifications", (
    (ph[badge image], [#ph[Adobe Certified Master — AEM Sites Architect] (Heading 3) \ #ph[Issued by Adobe] \ #ph[Valid Nov 2017 – May 2028] \ #underline(ph[Verify on Adobe]) (link)]),
  ), caption: [One row per badge: image | text]),
  {
    text(size: 9pt, weight: "bold")[How to fill it in]
    v(-2pt)
    set text(size: 8.5pt); set par(justify: false)
    [- Title = Heading 3; the link = the issuer's verification page
    - The other lines can be in any order
    - The badge image is linked to the Verify page automatically, and both open in a new tab
    - "External site · …" is added automatically from the link
    - New badge? Add a row, and add it to the *footer* strip too]
  },
)
]
```

# Navigation and Footer

The header and footer are two shared documents in the `0101` folder. Edit them once and every 0101 page updates on its next view. You don't need to republish the pages, only the `nav` or `footer` document itself.

## The `nav` Document

```{=typst}
#shot("img/nav.jpg", caption: [The header: logo, then six numbered links. The current page is highlighted.])
#v(4pt)
#grid(columns: (50%, 1fr), column-gutter: 10pt,
  block(width: 100%, inset: 10pt, radius: 6pt, stroke: 0.6pt + c-line, {
    text(size: 7pt, fill: c-muted)[DOCUMENT · /0101/nav]
    v(2pt)
    text(size: 8.5pt)[#ph[0101 logo image, linked to /0101/]]
    v(2pt)
    text(size: 9pt, fill: c-muted)[`---`]
    v(2pt)
    set text(size: 8.5pt)
    [• #underline[Home] \ • #underline[Samples] \ • #underline[Certifications] \ • #underline[Security] \ • #underline[Privacy] \ • #underline[Contact]]
  }),
  {
    set text(size: 8.5pt); set par(justify: false)
    [- Section 1: the logo, as an image inside a link
    - Section 2: a bulleted list of links
    - The numbers 01–06 are added automatically in list order
    - On phones the list moves behind the menu button]
  },
)
```

## The `footer` Document

```{=typst}
#shot("img/footer.jpg", caption: [The footer: copyright with links on the left, the badge strip on the right])
#v(4pt)
#text(size: 8.5pt)[Section 1 is one paragraph: `© 2026 0101 Technology LLC · Privacy · Security`, with the two links. Section 2 has three paragraphs: the word "Certifications", a paragraph of badge images (each linked to `/0101/certifications`, each with alt text naming the badge), and the trademark note. *Update the year every January.*]
```

# Page Metadata and Images

## Page Metadata

The **Metadata** table is always the last thing in the document. In Experience Workspace you can also edit it from the tools panel in *Page* mode.

| Row | What it does | Like in WordPress / HTML |
|:---|:---|:---|
| `Title` | Browser tab, search results and share title | Yoast SEO title / `<title>` |
| `Description` | Search and share snippet, 150–160 characters | Meta description |
| `Image` | Picture shown when the page is shared | Featured / social image, `og:image` |
| `Template` | Must stay `studio-0101`. Gives the page the 0101 theme. | The page template / theme |
| `nav`, `footer` | Must stay `nav` and `footer`. They pick the 0101 menu and footer from the same folder. | `header.php` / `footer.php` |

```{=typst}
#callout(kind: "warn", title: "Don't delete the last three rows")[
  Without `Template: studio-0101` the page loses the navy theme and fonts. Without `nav` and `footer` it shows the wrong menu. When you create a new page, copy the Metadata table from an existing 0101 page.
]
```

## Images and Media

```{=typst}
#table(
  columns: (32%, 1fr),
  [Task], [How],
  [Add an image], [Place the cursor, then use *Add image* on the toolbar, or drag the file in. It is stored in a hidden folder next to the page (for example `.samples/`).],
  [Alt text], [Always describe the image. Decorative images can have empty alt text, but in this site almost every image is meaningful.],
  [Replace a screenshot], [Delete the old image and insert the new one in the same cell. Keep the 16:10 shape so the Showcase grid stays even.],
  [Sizes and formats], [JPG, PNG, AVIF, GIF, SVG, PDF and MP4 are supported. Upload the largest sensible original: resizing, WebP conversion and lazy loading are automatic.],
)
```

# Preview and Publish

```{=typst}
#grid(columns: (1fr, 1fr), column-gutter: 8pt,
  callout(kind: "tip", title: "Preview")[Updates the `.aem.page` copy only. Share it with reviewers. Search engines don't see it, and it does not use your own domain.],
  callout(kind: "good", title: "Publish")[*Preview & Publish* updates the live site (`.aem.live` and your domain) in seconds. Both create a version automatically.],
)
#v(6pt)
#table(
  columns: (32%, 1fr),
  [I want to…], [Do this],
  [Publish one page], [In the editor: *Send* icon → *Preview & Publish* → *Update*],
  [Publish several pages], [In the content browser, tick them, then use *Publish* in the action bar. Or use *Apps → Bulk* with a list of URLs.],
  [Publish the menu or footer], [Open `nav` or `footer` and publish it like any page],
  [Get approval before going live], [Share the preview link, or create a *Snapshot* (*Apps → Snapshots*) for a password-protected review link],
  [Check quality first], [Tools panel → *Preflight*],
  [Undo a bad change], [Tools panel → *Versions* → pick a version → *Restore*, then publish again],
  [Take a page offline], [Ask the administrator to unpublish it. Deleting the document alone does not remove the live page.],
)
```

# Working with the AI Assistant

The assistant panel on the left can draft and edit content for you. It works best for small, clear requests, and it always asks before it changes the page.

| Good requests | Not for the assistant |
|:---|:---|
| "Tighten the lede on this page to two sentences." | Changing colours, fonts or layout. That is code. |
| "Add a new row to the Showcase for a project called *Atlas*, type *Data Platform*." | Editing the Contact Form's *Send to* address |
| "Check this page for spelling and passive voice." | Legal wording in the privacy policy, without review |
| "Translate this section into French as a draft." | Publishing without reading the result |

```{=typst}
#callout(kind: "warn", title: "Always read before you publish")[AI output can be wrong. Check facts, dates, prices and certification details yourself, and keep the privacy policy's legal wording unchanged unless it has been reviewed.]
```

# Help and Support

## Common Tasks

| Task | Steps |
|:---|:---|
| Change a headline | Type over it. Keep the highlighted words in *italic*. |
| Add a portfolio sample | Showcase → add a row → image, title, type, optional case study |
| Add a certification | Certifications block → add a row; then add the badge to the footer strip |
| Update privacy "Last updated" | Edit the line under the Privacy heading, then publish |
| Stop taking new projects | Contact → Facts → change *Status* |
| Create a new page | **New → Page** in `0101`, copy the content and Metadata from a similar page, then edit |

## Troubleshooting

| Problem | Likely cause and fix |
|:---|:---|
| A table shows up as a plain table on the page | The block name in row 1 is misspelled. Copy the block from another page. |
| A page is white with the wrong fonts | The Metadata `Template` row is missing or changed. It must be `studio-0101`. |
| The menu or footer is wrong or missing | The Metadata `nav` / `footer` rows are missing, or the `nav` / `footer` document isn't published |
| The diagram or form sits under the text on desktop | The section is missing `style: split`, or another block was added after it |
| Two sections merged into one | A horizontal rule (`---`) was deleted |
| A change is not live | You previewed but didn't publish. Look for the orange badge on the Send icon. |
| The contact form says it could not send | The receiving server is down or rejects the site. Contact the developer. Visitors are shown the fallback email. |

## Resources

- Experience Workspace authoring docs: `https://www.aem.live/docs/ew/authoring`
- Orientation (editor, assistant and tools panels): `https://www.aem.live/docs/ew/orientation`
- Publishing content: `https://www.aem.live/docs/ew/authoring/publishing`
- Companion document: **0101 Technology — Migration Report** (in the same folder)
