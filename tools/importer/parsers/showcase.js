/* eslint-disable */
/* global WebImporter */
/**
 * Showcase: one row per sample → image | title | type | case study (optional).
 * Source: #portfolioStack .p-card (built at load from the PANELS array in site.js).
 * The case studies exist only in that array (shown in the lightbox), so the two that
 * the source has are carried here, keyed by title.
 */
const CASE_STUDIES = {
  'muLLM Router': 'muLLM routes queries across local Ollama models, a ChromaDB semantic cache, and cloud fallback (Anthropic / OpenAI / Google). Intent classification + cost scoring achieved 99% cost reduction — $0.76 spent vs. $800 alternative for 1,338 queries. A 50-person team saves ~$5k/year with zero code changes to their existing LLM calls.',
  'Royal Ravine': 'Royal Ravine Versus: Node.js + Socket.io + Redis (Lua scripting) + PostgreSQL on AlmaLinux 9. Redis Lua atomics handle game state in milliseconds; MsgPack binary WebSocket encoding cuts bandwidth ~40%. Server-authoritative anti-cheat with session fingerprinting and room locks.',
};

export default function parse(element, { document }) {
  const cells = [['Showcase']];
  element.querySelectorAll('.p-card').forEach((card) => {
    const src = card.querySelector('img');
    const img = document.createElement('img');
    img.src = src ? src.src || src.getAttribute('src') : '';
    img.alt = src ? src.getAttribute('alt') || '' : '';
    const tag = card.querySelector('.tag');
    const kind = (tag?.querySelector('.kind')?.textContent || '').trim();
    let title = '';
    if (tag) {
      title = [...tag.childNodes]
        .filter((n) => !(n.nodeType === 1 && (n.tagName === 'B' || n.classList.contains('kind'))))
        .map((n) => n.textContent).join('').replace(/·\s*$/, '').trim();
    }
    cells.push([img, title, kind, CASE_STUDIES[title] || '']);
  });
  element.replaceWith(WebImporter.DOMUtils.createTable(cells, document));
}
