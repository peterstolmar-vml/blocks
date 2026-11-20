/* eslint-disable */
/* global WebImporter */
/** Stats: one row per stat → "SHIP/fast" | "Compressed delivery". Source: .stats > .stat */
export default function parse(element, { document }) {
  const cells = [['Stats']];
  element.querySelectorAll('.stat').forEach((s) => {
    cells.push([
      (s.querySelector('.num')?.textContent || '').trim(),
      (s.querySelector('.lbl')?.textContent || '').trim(),
    ]);
  });
  element.replaceWith(WebImporter.DOMUtils.createTable(cells, document));
}
