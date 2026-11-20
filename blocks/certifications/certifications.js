/**
 * Certifications: badge cards with an external verification link.
 * One row per badge: badge image | Heading 3 title, issuer and validity lines, Verify link.
 * Lines are recognised by type (heading, link, other text), so their order is free.
 * @param {Element} block The block element
 */

function srOnly(text) {
  const span = document.createElement('span');
  span.className = 'certifications-sr';
  span.textContent = text;
  return span;
}

export default function decorate(block) {
  const list = document.createElement('ul');
  [...block.children].forEach((row) => {
    const [imgCell, textCell] = row.children;
    if (!textCell) return;
    const heading = textCell.querySelector('h1, h2, h3, h4, h5, h6');
    const link = textCell.querySelector('a[href]');
    const title = heading ? heading.textContent.trim() : '';
    let host = '';
    try { host = link ? new URL(link.href).hostname.replace(/^www\./, '') : ''; } catch { /* ignore */ }

    const li = document.createElement('li');
    const picture = imgCell ? imgCell.querySelector('picture') : null;
    if (picture) {
      const badge = document.createElement(link ? 'a' : 'span');
      badge.className = 'certifications-badge';
      if (link) {
        badge.href = link.href;
        badge.target = '_blank';
        badge.rel = 'noopener noreferrer external';
        badge.append(picture, srOnly(` — verify on ${host} (external site, opens in a new tab)`));
      } else badge.append(picture);
      li.append(badge);
    }

    const h3 = document.createElement('h3');
    h3.textContent = title;
    li.append(h3);

    const meta = document.createElement('div');
    meta.className = 'certifications-meta';
    [...textCell.querySelectorAll('p')]
      .filter((p) => !p.querySelector('a'))
      .forEach((p) => meta.append(p));
    li.append(meta);

    if (link) {
      const verify = document.createElement('a');
      verify.className = 'certifications-verify';
      verify.href = link.href;
      verify.target = '_blank';
      verify.rel = 'noopener noreferrer external';
      verify.textContent = link.textContent.trim() || 'Verify';
      const ext = document.createElement('span');
      ext.setAttribute('aria-hidden', 'true');
      ext.textContent = ' ↗';
      verify.append(ext, srOnly(` — ${title} (external site, opens in a new tab)`));
      li.append(verify);
      const hostLine = document.createElement('p');
      hostLine.className = 'certifications-host';
      hostLine.textContent = `External site · ${host}`;
      li.append(hostLine);
    }
    list.append(li);
  });
  block.replaceChildren(list);
}
