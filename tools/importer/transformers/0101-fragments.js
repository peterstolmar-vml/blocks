/* eslint-disable */
/* global WebImporter */

import { viewFor, mapHref, absUrl, BASE } from './0101-cleanup.js';

/**
 * Builds the shared /0101/nav and /0101/footer documents from the home view's chrome, before
 * 0101-cleanup.js removes it. Runs only for the home view so each document is written once.
 *
 * nav:    section 1 = linked logo · section 2 = list of the six primary links
 * footer: section 1 = copyright line with links · section 2 = "Certifications" badge strip
 */
const BADGE_NAMES = {
  '480db2f7': 'Adobe Certified Master: Adobe Experience Manager Sites Architect',
  '2359f726': 'Adobe Certified Master: Adobe Target Architect',
  '9665d97b': 'Adobe Certified Expert: Adobe Experience Manager Dev/Ops Engineer',
  '2387ee1d': 'Adobe Qualified: GenStudio Technical',
  '2387d9c8': 'Adobe Qualified: Workfront Fusion',
  '238771fa': 'Adobe Qualified: Firefly Services',
  '02eb383a': 'Claude Certified Architect, Professional',
};

export default function transform(hookName, element, payload) {
  if (hookName !== 'beforeTransform') return;
  const { document, params } = payload;
  if (viewFor(params?.originalURL || payload.url) !== 'home' || !params.fragments) return;

  // ---- nav ----
  const nav = document.createElement('div');
  const brand = document.querySelector('header.chrome .brand img');
  const brandDiv = document.createElement('div');
  const bp = document.createElement('p');
  const ba = document.createElement('a');
  ba.href = `${BASE}/`;
  const logo = document.createElement('img');
  logo.src = absUrl(brand ? brand.getAttribute('src') : 'assets/logo/0101-logo-dark.svg');
  logo.alt = '0101 Technology — home';
  ba.append(logo);
  bp.append(ba);
  brandDiv.append(bp);
  const linksDiv = document.createElement('div');
  const ul = document.createElement('ul');
  document.querySelectorAll('nav.primary a').forEach((a) => {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = mapHref(a.getAttribute('href'));
    link.textContent = [...a.childNodes].filter((n) => !(n.nodeType === 1 && n.classList.contains('idx'))).map((n) => n.textContent).join('').trim();
    li.append(link);
    ul.append(li);
  });
  linksDiv.append(ul);
  nav.append(brandDiv, document.createElement('hr'), linksDiv);
  params.fragments.push({ element: nav, path: `${BASE}/nav` });

  // ---- footer ----
  const footer = document.createElement('div');
  const src = document.querySelector('footer.site-footer');
  if (src) {
    const copy = src.querySelector(':scope > p').cloneNode(true);
    copy.querySelectorAll('a').forEach((a) => {
      a.setAttribute('href', mapHref(a.getAttribute('href')));
      a.removeAttribute('data-page');
    });
    const strip = document.createElement('div');
    const label = document.createElement('p');
    label.textContent = (src.querySelector('.bs-label')?.textContent || 'Certifications').trim();
    const badges = document.createElement('p');
    src.querySelectorAll('.badge-strip img').forEach((img) => {
      const a = document.createElement('a');
      a.href = `${BASE}/certifications`;
      const i = document.createElement('img');
      i.src = absUrl(img.getAttribute('src'));
      // the source images are decorative inside one labelled link; each becomes its own link
      // here, so it needs a name (taken from the certifications page's badge alt text)
      const id = (img.getAttribute('src').match(/([0-9a-f]{8})-/) || [])[1];
      i.alt = BADGE_NAMES[id] || 'Certification badge';
      a.append(i);
      badges.append(a);
    });
    const tm = document.createElement('p');
    tm.textContent = (src.querySelector('.tm-note')?.textContent || '').trim();
    strip.append(label, badges, tm);
    footer.append(copy, document.createElement('hr'), strip);
  }
  params.fragments.push({ element: footer, path: `${BASE}/footer` });
}
