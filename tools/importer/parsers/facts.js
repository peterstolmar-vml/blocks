/* eslint-disable */
/* global WebImporter */
/** Facts: one row per detail → label | value (links kept). Source: dl.coord-grid */
export default function parse(element, { document }) {
  const cells = [['Facts']];
  element.querySelectorAll('dt').forEach((dt) => {
    const dd = dt.nextElementSibling;
    const value = document.createElement('div');
    if (dd) value.innerHTML = dd.innerHTML;
    cells.push([dt.textContent.trim(), value]);
  });
  element.replaceWith(WebImporter.DOMUtils.createTable(cells, document));
}
