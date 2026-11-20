/* eslint-disable */
/* global WebImporter */

import { ORIGIN } from './0101-cleanup.js';

/**
 * 0101technology.com serves its images with Cross-Origin-Resource-Policy: same-origin, so they
 * cannot be shown from another domain. Every source image is mirrored under /media-da/0101/
 * (same path as on the source) by tools/importer/0101-download-media.js, and the documents
 * point there. Called by the import scripts after WebImporter.rules.adjustImageUrls, which
 * would otherwise turn these root-relative paths back into source URLs.
 */
export default function localizeMedia(element) {
  element.querySelectorAll('img[src]').forEach((img) => {
    let u;
    try { u = new URL(img.getAttribute('src'), `${ORIGIN}/`); } catch (e) { return; }
    if (u.origin !== ORIGIN) return;
    img.setAttribute('src', `/media-da/0101${u.pathname}`);
  });
}
