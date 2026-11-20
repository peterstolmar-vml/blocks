/**
 * Agent Mesh: an illustrative, decorative agent-network diagram.
 * Row 1: title | tag line. Following rows: metric label | value.
 * The diagram and its activity log are drawn here; authors edit only the text.
 * @param {Element} block The block element
 */

const NODES = [
  {
    id: 'router', label: 'ROUTER', sub: '0x01', x: 70, y: 70,
  },
  {
    id: 'planner', label: 'PLANNER', sub: '0x02', x: 330, y: 70,
  },
  {
    id: 'kernel', label: 'KERNEL', sub: '0x00', x: 200, y: 180, hot: true,
  },
  {
    id: 'critic', label: 'CRITIC', sub: '0x03', x: 70, y: 290,
  },
  {
    id: 'tool', label: 'TOOLS', sub: '0x04', x: 330, y: 290,
  },
];
const EDGES = ['M70 70 L200 180', 'M330 70 L200 180', 'M70 290 L200 180', 'M330 290 L200 180'];
const CALLS = [
  ['router', 'kernel', 'llm.route', '{q:"vector",k:8}'],
  ['kernel', 'planner', 'plan/decompose', '{topic:"auth",n:3}'],
  ['planner', 'tool', 'tool.exec', '{q:"vector",k:8}'],
  ['tool', 'kernel', 'cache.lookup', '{depth:2}'],
  ['kernel', 'critic', 'critic.review', '{mode:"stream"}'],
  ['critic', 'router', 'route.score', '{tier:"local"}'],
];

function diagram() {
  const nodes = NODES.map((n) => {
    const r = n.hot ? 24 : 18;
    return `<g transform="translate(${n.x} ${n.y})">
      <circle r="${r + 14}" fill="url(#amGlow)"/><circle r="${r}" class="core${n.hot ? ' hot' : ''}"/>
      <text y="${-(r + 20)}">${n.label}</text><text y="${r + 28}" class="sub">${n.sub}</text></g>`;
  }).join('');
  const packets = EDGES.map((d, i) => `<circle r="2.5" class="packet">
      <animateMotion dur="${2.4 + i * 0.5}s" repeatCount="indefinite" path="${d}" ${i % 2 ? 'keyPoints="1;0" keyTimes="0;1"' : ''}/></circle>`).join('');
  return `<svg viewBox="0 0 400 360" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
    <defs><radialGradient id="amGlow" cx="50%" cy="50%"><stop offset="0" stop-color="#3dd9ff" stop-opacity=".45"/><stop offset="1" stop-color="#3dd9ff" stop-opacity="0"/></radialGradient></defs>
    <g class="edges">${EDGES.map((d) => `<path d="${d}"/>`).join('')}<path d="M70 70 L330 70" stroke-dasharray="2 4"/><path d="M70 290 L330 290" stroke-dasharray="2 4"/></g>
    <g class="packets">${packets}</g>
    <g class="nodes">${nodes}</g>
  </svg>`;
}

function logLine(i) {
  const [from, to, fn, args] = CALLS[i % CALLS.length];
  const t = new Date().toTimeString().slice(0, 8);
  const li = document.createElement('li');
  li.innerHTML = `<span class="t">${t}</span> ${from} →${to} <span class="fn">${fn}</span> ${args} <span class="ok">✓ ${(1.4 + Math.random() * 3).toFixed(1)}µs</span>`;
  return li;
}

export default function decorate(block) {
  const rows = [...block.children];
  const [titleRow, ...metricRows] = rows;
  const [titleCell, tagCell] = titleRow ? [...titleRow.children] : [];
  const title = titleCell ? titleCell.textContent.trim() : 'Agent Mesh';
  const tag = tagCell ? tagCell.textContent.trim() : '';

  const hud = document.createElement('figure');
  hud.className = 'agent-mesh-hud';
  hud.setAttribute('role', 'group');
  hud.setAttribute('aria-label', `Illustrative ${title.toLowerCase()} diagram`);

  const head = document.createElement('figcaption');
  head.className = 'agent-mesh-title';
  head.innerHTML = '<span></span><span class="agent-mesh-tag"></span>';
  head.children[0].textContent = `◉ ${title}`;
  head.children[1].textContent = tag ? `// ${tag}` : '';

  const stage = document.createElement('div');
  stage.className = 'agent-mesh-stage';
  stage.innerHTML = diagram();

  const log = document.createElement('ol');
  log.className = 'agent-mesh-log';
  log.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < 5; i += 1) log.append(logLine(i));

  const dl = document.createElement('dl');
  dl.className = 'agent-mesh-metrics';
  metricRows.forEach((row) => {
    const [k, v] = row.children;
    if (!k) return;
    const dt = document.createElement('dt');
    dt.textContent = k.textContent.trim();
    const dd = document.createElement('dd');
    dd.textContent = v ? v.textContent.trim() : '';
    dl.append(dt, dd);
  });

  hud.append(head, stage, log, dl);
  block.replaceChildren(hud);

  // live log, only while visible and when the visitor has not asked for reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let n = 5;
  let timer;
  const tick = () => {
    log.append(logLine(n));
    n += 1;
    while (log.children.length > 5) log.firstElementChild.remove();
  };
  new IntersectionObserver(([entry]) => {
    clearInterval(timer);
    if (entry.isIntersecting) timer = setInterval(tick, 1400);
  }).observe(block);
}
