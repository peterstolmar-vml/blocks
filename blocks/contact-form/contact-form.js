/**
 * Contact Form: the 0101 enquiry form.
 * Authors set it up with settings rows (setting | value):
 *   Send to, Interests (list), Stages (list), Budget max (k USD), Button,
 *   Thank-you heading, Thank-you text, Fallback email.
 * The fields are fixed in code. Submissions are POSTed as JSON to "Send to"; that endpoint
 * must accept cross-origin requests from this site.
 * @param {Element} block The block element
 */

const readSettings = (block) => {
  const settings = {};
  [...block.children].forEach((row) => {
    const [k, v] = row.children;
    if (!k || !v) return;
    const key = k.textContent.trim().toLowerCase().replace(/\(.*\)/, '').replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const items = [...v.querySelectorAll('li')].map((li) => li.textContent.trim());
    settings[key] = items.length ? items : v.textContent.trim();
  });
  return settings;
};

const asList = (v, fallback) => {
  if (Array.isArray(v)) return v;
  if (typeof v === 'string' && v) return v.split(',').map((s) => s.trim()).filter(Boolean);
  return fallback;
};

const el = (tag, attrs = {}, ...children) => {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (v === true) node.setAttribute(k, '');
    else if (v !== false && v != null) node.setAttribute(k, v);
  });
  node.append(...children);
  return node;
};

const fmtBudget = (k) => {
  if (+k === 0) return '$0 — Free';
  if (+k >= 500) return '$500k+';
  return `$${k}k`;
};

/** strips a leading decorative glyph ("◇ Custom Code" → "Custom Code") */
const cleanLabel = (s) => s.replace(/^[^\p{L}\p{N}]+/u, '').trim();

function field(id, label, input, helper) {
  const l = el('label', { for: id }, label);
  if (helper) l.append(' ', el('span', { class: 'contact-form-helper' }, helper));
  return el('div', { class: 'contact-form-field' }, l, input);
}

function rateLimited() {
  try {
    const key = '0101_rl';
    const now = Date.now();
    const log = JSON.parse(localStorage.getItem(key) || '[]').filter((t) => now - t < 600000);
    if (log.length >= 3) return true;
    log.push(now);
    localStorage.setItem(key, JSON.stringify(log));
  } catch { /* storage unavailable: allow */ }
  return false;
}

export default function decorate(block) {
  const s = readSettings(block);
  const endpoint = s['send-to'] || '/api/contact';
  const interests = asList(s.interests, []);
  const stages = asList(s.stages, ['Scoping', 'Building', 'Running']);
  const budgetMax = parseInt(s['budget-max'], 10) || 500;
  const fallbackEmail = s['fallback-email'] || '';
  const uid = Math.random().toString(36).slice(2, 7);
  const id = (n) => `cf-${uid}-${n}`;

  const form = el('form', { class: 'contact-form-form', novalidate: true });

  const row1 = el(
    'div',
    { class: 'contact-form-row' },
    field(id('name'), 'Name', el('input', {
      id: id('name'), name: 'name', type: 'text', required: true, autocomplete: 'name', placeholder: 'Ada Lovelace',
    })),
    field(id('email'), 'Email', el('input', {
      id: id('email'), name: 'email', type: 'email', required: true, autocomplete: 'email', placeholder: 'ada@domain.xyz',
    })),
  );
  const org = field(id('org'), 'Organization', el('input', {
    id: id('org'), name: 'org', type: 'text', autocomplete: 'organization', placeholder: 'Analytical Engines Inc.',
  }));

  // interests: toggle buttons
  const pills = el('div', { class: 'contact-form-pills', role: 'group', 'aria-labelledby': id('int') });
  interests.forEach((label) => {
    const b = el('button', {
      type: 'button', class: 'contact-form-pill', 'aria-pressed': 'false', 'data-val': cleanLabel(label),
    }, label);
    b.addEventListener('click', () => b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'));
    pills.append(b);
  });
  const interestsField = el(
    'div',
    { class: 'contact-form-field' },
    el('span', { class: 'contact-form-label', id: id('int') }, 'Interests ', el('span', { class: 'contact-form-helper' }, 'select any')),
    pills,
  );

  // start date + stage
  const start = field(id('start'), 'Preferred start', el('input', { id: id('start'), name: 'start', type: 'date' }));
  const seg = el('div', { class: 'contact-form-seg', role: 'radiogroup', 'aria-labelledby': id('stage') });
  stages.forEach((label, i) => {
    const rid = id(`stage-${i}`);
    seg.append(
      el('input', {
        type: 'radio', name: 'stage', id: rid, value: label, checked: i === 0,
      }),
      el('label', { for: rid }, label),
    );
  });
  const stageField = el('div', { class: 'contact-form-field' }, el('span', { class: 'contact-form-label', id: id('stage') }, 'Stage'), seg);
  const row2 = el('div', { class: 'contact-form-row' }, start, stageField);

  // budget
  const out = el('output', { for: id('budget') }, fmtBudget(50));
  const range = el('input', {
    id: id('budget'), name: 'budget', type: 'range', min: '0', max: String(budgetMax), step: '5', value: '50',
  });
  range.addEventListener('input', () => { out.textContent = fmtBudget(range.value); });
  const budget = el(
    'div',
    { class: 'contact-form-field' },
    el('label', { for: id('budget') }, 'Budget ', el('span', { class: 'contact-form-helper' }, 'USD · ', out)),
    range,
    el('div', { class: 'contact-form-ticks', 'aria-hidden': 'true' }, el('span', {}, '$0'), el('span', {}, `$${Math.round(budgetMax / 5)}k`), el('span', {}, `$${Math.round(budgetMax / 2)}k`), el('span', {}, `$${budgetMax}k+`)),
  );

  const msg = field(id('msg'), 'Message', el('textarea', { id: id('msg'), name: 'msg', placeholder: 'How can we help?' }), 'optional');

  // accessible math CAPTCHA + honeypot
  const q = el('span', { 'aria-live': 'polite' });
  let answer = 0;
  const newCaptcha = () => {
    const a = 1 + Math.floor(Math.random() * 9);
    const b = 1 + Math.floor(Math.random() * 9);
    answer = a + b;
    q.textContent = `${a} + ${b}`;
  };
  newCaptcha();
  const captchaInput = el('input', {
    id: id('captcha'), name: 'captcha', type: 'text', inputmode: 'numeric', autocomplete: 'off', required: true, placeholder: 'your answer',
  });
  const captcha = el('div', { class: 'contact-form-field contact-form-captcha' }, el('label', { for: id('captcha') }, 'Security check: ', q, ' = ?'), captchaInput);
  const honeypot = el('div', { class: 'contact-form-hp', 'aria-hidden': 'true' }, el('label', { for: id('website') }, 'Website (leave blank)'), el('input', {
    id: id('website'), name: 'website', type: 'text', tabindex: '-1', autocomplete: 'off',
  }));

  const submit = el('button', { type: 'submit', class: 'button primary' }, s.button || 'Send message');
  const status = el('p', { class: 'contact-form-status', role: 'status' });
  const error = el('p', { class: 'contact-form-error', role: 'alert' });

  form.append(row1, org, interestsField, row2, budget, msg);
  form.append(captcha, honeypot, submit, status, error);

  // thank-you dialog
  const ref = el('b', {}, '');
  const thanks = el(
    'dialog',
    { class: 'contact-form-thanks', 'aria-labelledby': id('thx') },
    el('h2', { id: id('thx') }, s['thank-you-heading'] || 'Message received.'),
    el('p', {}, s['thank-you-text'] || 'Thank you. We will be in touch shortly.'),
    el('p', { class: 'contact-form-ref' }, 'REF · ', ref),
  );
  const close = el('button', { type: 'button', class: 'button secondary' }, 'Close');
  close.addEventListener('click', () => thanks.close());
  thanks.append(close);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    error.textContent = '';
    const fail = (text) => { error.textContent = text; };
    const data = new FormData(form);
    if (!form.checkValidity()) {
      fail('Please enter your name and a valid email address, and answer the security check.');
      form.querySelector(':invalid')?.focus();
      return;
    }
    if (parseInt(String(data.get('captcha')).trim(), 10) !== answer) {
      fail('Security check failed — please recheck your answer.');
      newCaptcha();
      captchaInput.value = '';
      captchaInput.focus();
      return;
    }
    if (rateLimited()) {
      fail('Too many messages in a short time. Please wait a few minutes and try again.');
      return;
    }
    const code = `0101-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
    const typed = String(data.get('msg') || '').trim();
    const payload = {
      ref_code: code,
      name: data.get('name'),
      email: data.get('email'),
      org: data.get('org') || '',
      message: typed || (+range.value === 0 ? 'Free 15-minute Quick Help requested.' : '(No message provided.)'),
      interests: [...pills.querySelectorAll('[aria-pressed="true"]')].map((p) => p.dataset.val),
      budget: fmtBudget(range.value),
      stage: data.get('stage') || '',
      start_date: data.get('start') || '',
      honeypot: data.get('website') || '',
    };
    submit.disabled = true;
    status.textContent = 'Sending…';
    try {
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      status.textContent = 'Sent';
      ref.textContent = code;
      form.reset();
      out.textContent = fmtBudget(range.value);
      pills.querySelectorAll('[aria-pressed="true"]').forEach((p) => p.setAttribute('aria-pressed', 'false'));
      newCaptcha();
      thanks.showModal();
      close.focus();
    } catch (err) {
      status.textContent = '';
      fail(`We could not send your message. Please try again${fallbackEmail ? `, or email ${fallbackEmail}` : ''}.`);
    } finally {
      submit.disabled = false;
    }
  });

  block.replaceChildren(form, thanks);
}
