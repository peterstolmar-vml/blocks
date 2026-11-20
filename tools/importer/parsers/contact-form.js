/* eslint-disable */
/* global WebImporter */
/**
 * Contact Form: settings rows (setting | value). The fields themselves are built by the block
 * code. Source: form#contactForm and the thank-you dialog / submit logic in site.js.
 */
export default function parse(element, { document }) {
  const list = (items) => {
    const ul = document.createElement('ul');
    items.forEach((t) => { const li = document.createElement('li'); li.textContent = t; ul.append(li); });
    return ul;
  };
  const interests = [...element.querySelectorAll('#interests .pill')].map((p) => p.textContent.trim());
  const stages = [...element.querySelectorAll('#stage-seg button')].map((b) => b.textContent.trim());
  const budget = element.querySelector('#budget');
  const submit = element.querySelector('.submit-btn');
  const submitLabel = submit ? [...submit.childNodes].filter((n) => !(n.nodeType === 1)).map((n) => n.textContent).join('').trim() : 'Send message';
  const cells = [
    ['Contact Form'],
    ['Send to', 'https://0101technology.com/api/contact'],
    ['Interests', list(interests)],
    ['Stages', list(stages)],
    ['Budget max (k USD)', budget ? budget.getAttribute('max') : '500'],
    ['Button', submitLabel || 'Send message'],
    ['Thank-you heading', 'Message received.'],
    ['Thank-you text', 'Thank you. We reply to every enquiry, usually within one business day.'],
    ['Fallback email', 'peter@0101technology.com'],
  ];
  element.replaceWith(WebImporter.DOMUtils.createTable(cells, document));
}
