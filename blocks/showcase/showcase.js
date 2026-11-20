/**
 * Showcase: a numbered grid of project screenshots with a lightbox.
 * One row per sample: image | title | type | case study (optional).
 * @param {Element} block The block element
 */

const pad = (n) => String(n).padStart(2, '0');

function caption(item, i) {
  const cap = document.createElement('p');
  cap.className = 'showcase-tag';
  cap.innerHTML = '<b></b><span class="showcase-title"></span><span class="showcase-kind"></span>';
  cap.children[0].textContent = pad(i + 1);
  cap.children[1].textContent = item.title;
  cap.children[2].textContent = item.kind ? ` · ${item.kind}` : '';
  return cap;
}

function buildLightbox(items) {
  const dialog = document.createElement('dialog');
  dialog.className = 'showcase-lightbox';
  dialog.setAttribute('aria-label', 'Project sample');
  dialog.innerHTML = `
    <button type="button" class="showcase-close" aria-label="Close">×</button>
    <button type="button" class="showcase-nav prev" aria-label="Previous sample">‹</button>
    <figure><div class="showcase-frame"></div><figcaption></figcaption></figure>
    <button type="button" class="showcase-nav next" aria-label="Next sample">›</button>`;
  let current = 0;
  const frame = dialog.querySelector('.showcase-frame');
  const figcaption = dialog.querySelector('figcaption');
  const show = (i) => {
    current = (i + items.length) % items.length;
    const item = items[current];
    const img = document.createElement('img');
    img.src = item.full;
    img.alt = item.alt;
    frame.replaceChildren(img);
    figcaption.replaceChildren(caption(item, current));
    if (item.study) {
      const p = document.createElement('p');
      p.className = 'showcase-study';
      p.textContent = item.study;
      figcaption.append(p);
    }
  };
  dialog.querySelector('.showcase-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('.prev').addEventListener('click', () => show(current - 1));
  dialog.querySelector('.next').addEventListener('click', () => show(current + 1));
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
  return { dialog, open: (i) => { show(i); dialog.showModal(); } };
}

export default function decorate(block) {
  const items = [...block.children].map((row) => {
    const [imgCell, titleCell, kindCell, studyCell] = row.children;
    const picture = imgCell ? imgCell.querySelector('picture') : null;
    const img = imgCell ? imgCell.querySelector('img') : null;
    if (!img) return null;
    const full = new URL(img.currentSrc || img.src, window.location);
    if (full.searchParams.has('width')) full.searchParams.set('width', '2000');
    return {
      picture,
      full: full.href,
      alt: img.alt || '',
      title: titleCell ? titleCell.textContent.trim() : '',
      kind: kindCell ? kindCell.textContent.trim() : '',
      study: studyCell ? studyCell.textContent.trim() : '',
    };
  }).filter(Boolean);

  const { dialog, open } = buildLightbox(items);
  const list = document.createElement('ul');
  items.forEach((item, i) => {
    const li = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'showcase-card';
    button.setAttribute('aria-label', `Open ${item.title}${item.kind ? ` — ${item.kind}` : ''}, full size`);
    const frame = document.createElement('span');
    frame.className = 'showcase-frame';
    frame.append(item.picture);
    button.append(frame, caption(item, i));
    button.addEventListener('click', () => open(i));
    li.append(button);
    list.append(li);
  });
  block.replaceChildren(list, dialog);
}
