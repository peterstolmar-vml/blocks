/* eslint-disable */
/* global WebImporter */
/**
 * Certifications: one row per badge → badge image | title (Heading 3), issuer, validity,
 * Verify link. Source: ul.cert-grid > li.cert-card
 */
export default function parse(element, { document }) {
  const cells = [['Certifications']];
  element.querySelectorAll('li.cert-card').forEach((card) => {
    const src = card.querySelector('.cert-badge img');
    const img = document.createElement('img');
    if (src) { img.src = src.getAttribute('src'); img.alt = src.getAttribute('alt') || ''; }
    const text = document.createElement('div');
    const h3 = document.createElement('h3');
    h3.textContent = (card.querySelector('h3')?.textContent || '').trim();
    text.append(h3);
    card.querySelectorAll('.cert-meta dd').forEach((dd) => {
      const p = document.createElement('p');
      p.textContent = dd.textContent.trim();
      text.append(p);
    });
    const v = card.querySelector('.cert-verify');
    if (v) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = v.getAttribute('href');
      a.textContent = v.textContent.replace(/↗/g, '').trim();
      p.append(a);
      text.append(p);
    }
    cells.push([img, text]);
  });
  element.replaceWith(WebImporter.DOMUtils.createTable(cells, document));
}
