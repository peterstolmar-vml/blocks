/* eslint-disable */
/* global WebImporter */

/**
 * 0101 Technology cleanup.
 *
 * The source index.html holds five views (#home, #portfolio, #security, #privacy, #contact)
 * that JavaScript switches between; certifications.html is a normal page. This transformer
 * keeps only the requested view, drops the site chrome (header, nav, footer, shader canvas,
 * dialogs), rewrites hash/relative links to the new /0101/ pages, turns <button data-page>
 * calls to action into authored buttons, and groups content into section wrappers
 * (<div data-section="style">) that 0101-sections.js turns into EDS sections.
 */

export const ORIGIN = 'https://0101technology.com';
export const BASE = '/0101';

const VIEW_PATHS = {
  home: `${BASE}/`,
  portfolio: `${BASE}/samples`,
  security: `${BASE}/security`,
  privacy: `${BASE}/privacy`,
  contact: `${BASE}/contact`,
};

/** Which view a URL asks for: certifications, or one of the five index.html hash views. */
export function viewFor(url) {
  try {
    const u = new URL(url);
    if (/certifications(\.html)?$/.test(u.pathname)) return 'certifications';
    const h = (u.hash || '').replace('#', '');
    return VIEW_PATHS[h] ? h : 'home';
  } catch (e) {
    return 'home';
  }
}

/** Map any source href (hash view, index.html#x, certifications.html, relative) to its new address. */
export function mapHref(href) {
  if (!href) return href;
  if (/^(mailto:|tel:)/i.test(href)) return href;
  if (href === BASE || href.startsWith(`${BASE}/`)) return href; // already mapped
  let u;
  try { u = new URL(href, `${ORIGIN}/`); } catch (e) { return href; }
  if (u.origin !== ORIGIN) return u.href;
  const hash = u.hash.replace('#', '');
  if (/certifications(\.html)?$/.test(u.pathname)) return `${BASE}/certifications`;
  if (u.pathname === '/' || /\/index\.html$/.test(u.pathname)) {
    if (hash === 'main' || hash === '') return VIEW_PATHS.home;
    return VIEW_PATHS[hash] || VIEW_PATHS.home;
  }
  return u.href;
}

export function absUrl(src) {
  try { return new URL(src, `${ORIGIN}/`).href; } catch (e) { return src; }
}

/** <button|a class="btn primary|ghost"> → <p><strong|em><a href>Label</a></strong|em></p> */
function toButtonParagraph(document, el) {
  const label = [...el.childNodes]
    .filter((n) => !(n.nodeType === 1 && n.classList.contains('arrow')))
    .map((n) => n.textContent).join('').trim();
  const href = el.dataset && el.dataset.page ? (VIEW_PATHS[el.dataset.page] || VIEW_PATHS.home) : mapHref(el.getAttribute('href'));
  const a = document.createElement('a');
  a.href = href;
  a.textContent = label;
  const wrap = document.createElement(el.classList.contains('ghost') ? 'em' : 'strong');
  wrap.append(a);
  const p = document.createElement('p');
  p.append(wrap);
  return p;
}

function section(document, style, nodes) {
  const div = document.createElement('div');
  div.setAttribute('data-section', style || '');
  nodes.filter(Boolean).forEach((n) => div.append(n));
  return div;
}

/** Normalises text-level markup inside a view before it is regrouped. */
function normalise(document, root) {
  // screen-reader-only helper text would show as visible text in a document
  root.querySelectorAll('.sr-only, .ext, .arrow, svg').forEach((n) => n.remove());
  // "glitch" highlight → italic, which the 0101 theme shows in cyan
  root.querySelectorAll('.glitch').forEach((s) => {
    const em = document.createElement('em');
    em.textContent = s.textContent;
    s.replaceWith(em);
  });
  root.querySelectorAll('.eyebrow').forEach((e) => {
    const p = document.createElement('p');
    p.textContent = e.textContent.trim();
    e.replaceWith(p);
  });
  root.querySelectorAll('a[href]').forEach((a) => {
    a.setAttribute('href', mapHref(a.getAttribute('href')));
    a.removeAttribute('target');
    a.removeAttribute('rel');
  });
  root.querySelectorAll('img[src]').forEach((img) => img.setAttribute('src', absUrl(img.getAttribute('src'))));
  root.querySelectorAll('time').forEach((t) => t.replaceWith(document.createTextNode(t.textContent)));
}

function buttons(document, root, selector) {
  const row = root.querySelector(selector);
  if (!row) return [];
  return [...row.querySelectorAll('.btn')].map((b) => toButtonParagraph(document, b));
}

function viewSections(document, view, src) {
  const q = (s) => src.querySelector(s);
  const qa = (s) => [...src.querySelectorAll(s)];
  switch (view) {
    case 'home': {
      const col = q('.home-wrap > div');
      return [section(document, 'split', [
        ...[...col.children].filter((c) => !c.matches('.cta-row, .stats')),
        ...buttons(document, col, '.cta-row'),
        q('.stats'),
        q('.procviz'),
      ])];
    }
    case 'portfolio': {
      const head = q('.portfolio-head');
      return [
        section(document, 'glass', [...[...head.children].filter((c) => !c.matches('.portfolio-cta')), ...buttons(document, head, '.portfolio-cta')]),
        section(document, '', [q('#portfolioStack')]),
        section(document, 'center', buttons(document, src, '.portfolio-end-cta')),
      ];
    }
    case 'security':
    case 'privacy': {
      const wrap = q('.sec-wrap, .priv-wrap');
      const lead = [...wrap.children].filter((c) => !c.matches('.content-glass, .cta-row-sec'));
      const panels = qa('.content-glass').map((g) => section(document, 'glass, narrow', [...g.children]));
      return [
        section(document, 'narrow', lead),
        ...panels,
        section(document, 'narrow', buttons(document, wrap, '.cta-row-sec')),
      ];
    }
    case 'contact': {
      const col = q('.contact-wrap > div');
      return [section(document, 'split', [...col.children, q('#contactForm')])];
    }
    case 'certifications': {
      const main = q('main');
      const lead = [...main.children].filter((c) => !c.matches('section, .cert-cta'));
      const groups = qa('.cert-group').map((g) => section(document, '', [...g.children]));
      const legal = q('.legal-note');
      return [
        section(document, 'narrow', lead),
        ...groups,
        section(document, 'legal, narrow', legal ? [...legal.children] : []),
        section(document, 'center', buttons(document, main, '.cert-cta')),
      ];
    }
    default:
      return [];
  }
}

export default function transform(hookName, element, payload) {
  if (hookName !== 'beforeTransform') return;
  const { document } = payload;
  const url = payload.params?.originalURL || payload.url;
  const view = viewFor(url);

  // Work on a detached copy of the source content for the requested view.
  let src;
  if (view === 'certifications') {
    src = document.createElement('div');
    const main = document.querySelector('main');
    if (main) src.append(main.cloneNode(true));
  } else {
    const page = document.querySelector(`#page-${view} .page-inner`);
    src = page ? page.cloneNode(true) : document.createElement('div');
  }
  // dynamic duplicates of the portfolio (cycling stage, counter) — the stack holds every sample
  src.querySelectorAll('#panelStage, #pCounter, .hp, .thanks').forEach((n) => n.remove());

  // Keep form/diagram/stack intact for their parsers; normalise everything else.
  normalise(document, src);

  const sections = viewSections(document, view, src);

  // Replace the whole body with just this view's sections.
  element.innerHTML = '';
  sections.forEach((s) => element.append(s));
  element.setAttribute('data-0101-view', view);
}
