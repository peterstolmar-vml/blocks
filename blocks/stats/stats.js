/**
 * Stats: one row per stat, "SHIP/fast" | "Compressed delivery".
 * The part before the slash is highlighted.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const list = document.createElement('ul');
  [...block.children].forEach((row) => {
    const [numCell, labelCell] = row.children;
    if (!numCell) return;
    const li = document.createElement('li');
    const num = document.createElement('p');
    num.className = 'stats-num';
    const text = numCell.textContent.trim();
    const slash = text.indexOf('/');
    if (slash > 0) {
      const strong = document.createElement('span');
      strong.textContent = text.slice(0, slash);
      num.append(strong, document.createTextNode(text.slice(slash)));
    } else {
      num.textContent = text;
    }
    const label = document.createElement('p');
    label.className = 'stats-label';
    label.textContent = labelCell ? labelCell.textContent.trim() : '';
    li.append(num, label);
    list.append(li);
  });
  block.replaceChildren(list);
}
