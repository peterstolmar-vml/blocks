/* eslint-disable */
/* global WebImporter */
/** Feature Grid: one row per item → code | title | description. Source: .owasp-grid > .owasp-item */
export default function parse(element, { document }) {
  const cells = [['Feature Grid']];
  element.querySelectorAll('.owasp-item').forEach((it) => {
    cells.push(['.on', '.ot', '.od'].map((s) => (it.querySelector(s)?.textContent || '').trim()));
  });
  element.replaceWith(WebImporter.DOMUtils.createTable(cells, document));
}
