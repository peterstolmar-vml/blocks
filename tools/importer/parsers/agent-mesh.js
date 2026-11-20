/* eslint-disable */
/* global WebImporter */
/**
 * Agent Mesh: row 1 = title | tag line, then one row per metric (label | value).
 * The diagram itself is drawn by the block code. Source: aside.procviz
 */
export default function parse(element, { document }) {
  const head = element.querySelector('.hudtitle');
  const idEl = head?.querySelector('.id');
  const titleEl = head ? [...head.querySelectorAll('span')].find((s) => !s.classList.contains('id')) : null;
  const tc = (s) => s.toLowerCase().replace(/(^|\s)\S/g, (m) => m.toUpperCase());
  const title = tc((titleEl?.textContent || 'Agent Mesh').replace(/[◉●]/g, '').trim()) || 'Agent Mesh';
  const tag = (idEl?.textContent || '').replace(/^\s*\/\/\s*/, '').replace(/DEMO/, 'Demo').trim();
  const cells = [['Agent Mesh'], [title, tag]];
  element.querySelectorAll('dl dt').forEach((dt) => {
    const dd = dt.nextElementSibling;
    cells.push([dt.textContent.trim(), (dd?.textContent || '').trim()]);
  });
  element.replaceWith(WebImporter.DOMUtils.createTable(cells, document));
}
