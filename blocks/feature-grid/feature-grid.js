/**
 * Feature Grid: one row per item, code | title | description.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const list = document.createElement('ul');
  [...block.children].forEach((row) => {
    const cells = [...row.children].map((c) => c.textContent.trim());
    if (!cells.some(Boolean)) return;
    const [code, title, text] = cells.length >= 3 ? cells : ['', ...cells];
    const li = document.createElement('li');
    if (code) {
      const c = document.createElement('p');
      c.className = 'feature-grid-code';
      c.textContent = code;
      li.append(c);
    }
    const h = document.createElement('h3');
    h.textContent = title;
    li.append(h);
    if (text) {
      const p = document.createElement('p');
      p.className = 'feature-grid-text';
      p.textContent = text;
      li.append(p);
    }
    list.append(li);
  });
  block.replaceChildren(list);
}
