/**
 * Facts: one row per detail, label | value. Rendered as a description list.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const dl = document.createElement('dl');
  [...block.children].forEach((row) => {
    const [label, value] = row.children;
    if (!label) return;
    const dt = document.createElement('dt');
    dt.textContent = label.textContent.trim();
    const dd = document.createElement('dd');
    if (value) dd.append(...value.childNodes);
    dl.append(dt, dd);
  });
  block.replaceChildren(dl);
}
