/* eslint-disable */
/* global WebImporter */

import { viewFor, BASE, ORIGIN } from './0101-cleanup.js';

/**
 * Turns the <div data-section="style"> wrappers left by 0101-cleanup.js into EDS sections
 * (content + optional Section Metadata, separated by <hr>), then writes the page Metadata.
 * The importer's generic createMetadata is not used: every view of index.html shares one
 * <head>, so titles and descriptions come from the source's per-view titles instead.
 */

const META = {
  home: {
    title: '0101 Technology — Production software, fast',
    description: '0101 Technology builds production-grade software fast — native desktop, web, mobile, VR/XR, data-viz, and AI/LLM integration. Oregon-based engineering studio.',
  },
  portfolio: {
    title: 'Samples — 0101 Technology',
    description: 'Samples from our software projects — real live working software, real data. Not mockups.',
  },
  security: {
    title: 'Security Practices — 0101 Technology',
    description: 'Security by design: how 0101 Technology prevents the OWASP Top 10 (2025) and applies Privacy by Design.',
  },
  privacy: {
    title: 'Privacy Policy — 0101 Technology',
    description: 'How 0101 Technology LLC collects, uses, retains and protects personal information, and your rights under GDPR and CCPA.',
  },
  contact: {
    title: 'Contact — 0101 Technology',
    description: 'Get help solving business challenges, untangling legacy or vibecoded software, even advancing your own LLM and AI research.',
  },
  certifications: {
    title: 'Certifications — 0101 Technology',
    description: 'Current Adobe and Anthropic certifications held at 0101 Technology, each linked to the issuer\'s verification page.',
  },
};

export default function transform(hookName, element, payload) {
  if (hookName !== 'afterTransform') return;
  const { document } = payload;
  const wrappers = [...element.querySelectorAll(':scope > div[data-section]')];
  if (!wrappers.length) return; // fragments (nav/footer) have no sections

  wrappers.forEach((wrap, i) => {
    const style = wrap.getAttribute('data-section');
    const nodes = [...wrap.childNodes];
    if (i > 0) wrap.before(document.createElement('hr'));
    nodes.forEach((n) => wrap.before(n));
    if (style) {
      wrap.before(WebImporter.DOMUtils.createTable([['Section Metadata'], ['style', style]], document));
    }
    wrap.remove();
  });

  const view = viewFor(payload.params?.originalURL || payload.url);
  const meta = META[view] || META.home;
  const img = document.createElement('img');
  img.src = `${ORIGIN}/images/og-card.png`;
  img.alt = '0101 Technology';
  element.append(WebImporter.DOMUtils.createTable([
    ['Metadata'],
    ['Title', meta.title],
    ['Description', meta.description],
    ['Image', img],
    ['Template', 'studio-0101'],
    ['nav', 'nav'], // relative: the nav document in the same folder
    ['footer', 'footer'],
  ], document));
}
