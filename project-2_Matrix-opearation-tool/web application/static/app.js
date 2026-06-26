/* ══════════════════════════════════════════════════
   Matrix Operations Tool — app.js
   Boot → Dimensions → Data Entry → Execute → Result
══════════════════════════════════════════════════ */

'use strict';

// ── State ────────────────────────────────────────
const S = {
  dims: { a: { rows: 3, cols: 3 }, b: { rows: 3, cols: 3 } },
  stage: 1,
  op: null,
  history: [],
  histOpen: false,
  lastResult: null
};

// ── Helpers ──────────────────────────────────────
const $ = id => document.getElementById(id);
const sleep = ms => new Promise(r => setTimeout(r, ms));

function formatNum(n) {
  if (n === null || n === undefined) return '—';
  if (!isFinite(n)) return String(n);
  const r = Math.round(n * 10000) / 10000;
  if (Number.isInteger(r)) return String(r);
  return r.toFixed(4).replace(/\.?0+$/, '');
}

// ══════════════════════════════════════════════════
//  BOOT SEQUENCE
// ══════════════════════════════════════════════════
let rainTimer = null;
let rainDrops = [];
const FS = 14;

function startRain() {
  const canvas = $('rain-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF<>{}[]|';
  const cols  = Math.floor(canvas.width / FS);
  rainDrops = Array(cols).fill(1);

  rainTimer = setInterval(() => {
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${FS}px JetBrains Mono, monospace`;

    for (let i = 0; i < rainDrops.length; i++) {
      const ch = CHARS[Math.floor(Math.random() * CHARS.length)];
      const x  = i * FS;
      const y  = rainDrops[i] * FS;

      // Lead char → Deep Emerald bright, rest → muted dark greens
      if (rainDrops[i] * FS > canvas.height * 0.85) {
        ctx.fillStyle = 'rgba(5, 150, 105, 1.0)';   // deep emerald bright lead
      } else if (Math.random() > 0.94) {
        ctx.fillStyle = 'rgba(16, 185, 129, 0.85)';  // mid emerald highlight
      } else {
        ctx.fillStyle = 'rgba(5, 150, 105, 0.35)';   // deep emerald dimmed trail
      }

      ctx.fillText(ch, x, y);
      if (y > canvas.height && Math.random() > 0.975) rainDrops[i] = 0;
      rainDrops[i]++;
    }
  }, 50);
}

const TERMINAL_LINES = [
  '> MATRIX OPERATIONS TOOL ',
  '> INITIALIZING......................OK',
  '> WELCOME',
];

async function runTerminal() {
  const box   = $('terminal-box');
  const lines = $('terminal-lines');
  box.style.display = 'block';

  for (const txt of TERMINAL_LINES) {
    const div = document.createElement('div');
    div.textContent = '';
    lines.appendChild(div);

    for (const ch of txt) {
      div.textContent += ch;
      await sleep(25);
    }
    await sleep(150);
  }
}

async function bootSequence() {
  startRain();
  await sleep(600);

  // Dim the rain, show terminal
  $('rain-canvas').style.transition = 'opacity .4s';
  $('rain-canvas').style.opacity    = '0.35';
  await runTerminal();
  await sleep(600);

  // Fade out terminal
  $('terminal-box').style.transition = 'opacity .4s';
  $('terminal-box').style.opacity    = '0';
  await sleep(400);
  $('terminal-box').style.display    = 'none';

  // Show title
  $('boot-title').classList.remove('hidden');
  await sleep(2500);

  // Transition out
  const bs = $('boot-screen');
  bs.style.transition = 'opacity .8s ease';
  bs.style.opacity    = '0';
  await sleep(800);
  bs.style.display = 'none';
  if (rainTimer) { clearInterval(rainTimer); rainTimer = null; }

  // Show app
  $('main-app').classList.remove('hidden');
  renderDots('a');
  renderDots('b');
}

window.addEventListener('resize', () => {
  const c = $('rain-canvas');
  if (c && c.style.display !== 'none' && rainTimer) {
    c.width  = window.innerWidth;
    c.height = window.innerHeight;
    const cols = Math.floor(c.width / FS);
    const newDrops = Array(cols).fill(1);
    for (let i = 0; i < Math.min(rainDrops.length, newDrops.length); i++) {
      newDrops[i] = rainDrops[i];
    }
    rainDrops = newDrops;
  }
});

// ══════════════════════════════════════════════════
//  STAGE MANAGEMENT
// ══════════════════════════════════════════════════
function goToStage(n) {
  document.querySelectorAll('.stage').forEach(s => s.classList.remove('active'));
  $(`stage-${n}`).classList.add('active');
  S.stage = n;

  // Step nodes
  for (let i = 1; i <= 3; i++) {
    const nd = $(`sn-${i}`);
    nd.classList.remove('active', 'done');
    if (i === n)  nd.classList.add('active');
    if (i < n)    nd.classList.add('done');
  }
  // Step bars
  for (let i = 1; i <= 2; i++) {
    const bar = $(`sb-${i}`);
    if (bar) bar.classList.toggle('done', i < n);
  }

  // Reset result / error when entering stage 3
  if (n === 3) {
    $('result-panel').classList.add('hidden');
    $('err-panel').classList.add('hidden');
    S.op = null;
    document.querySelectorAll('.op-card').forEach(c => c.classList.remove('selected'));
    $('btn-execute').disabled = true;
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ══════════════════════════════════════════════════
//  DIMENSIONS (STAGE 1)
// ══════════════════════════════════════════════════
function changeDim(m, axis, delta) {
  const cur  = S.dims[m][axis];
  const next = Math.max(1, Math.min(6, cur + delta));
  S.dims[m][axis] = next;

  const key = axis === 'rows' ? `val-${m}-rows` : `val-${m}-cols`;
  $(key).textContent = next;
  renderDots(m);
}

function renderDots(m) {
  const { rows, cols } = S.dims[m];
  const grid = $(`dot-${m}`);
  grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  grid.innerHTML = '';
  for (let i = 0; i < rows * cols; i++) {
    const d = document.createElement('div');
    d.className = 'dot';
    d.style.opacity = String(0.15 + (i / (rows * cols)) * 0.65);
    grid.appendChild(d);
  }
}

async function proceedToEntry() {
  const btn = document.querySelector('#stage-1 .btn-primary');
  if (btn) {
    btn.classList.add('pulse-click');
    await sleep(200);
    btn.classList.remove('pulse-click');
  }
  buildGrid('a');
  buildGrid('b');
  $('badge-a').textContent = `${S.dims.a.rows}×${S.dims.a.cols}`;
  $('badge-b').textContent = `${S.dims.b.rows}×${S.dims.b.cols}`;
  goToStage(2);
}

// ══════════════════════════════════════════════════
//  GRID BUILDING (STAGE 2)
// ══════════════════════════════════════════════════
function buildGrid(m) {
  const { rows, cols } = S.dims[m];
  const grid = $(`grid-${m}`);
  grid.style.gridTemplateColumns = `repeat(${cols}, clamp(36px,7vw,50px))`;
  grid.innerHTML = '';
  $(`ready-${m}`).classList.remove('show');

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const inp = document.createElement('input');
      inp.type        = 'text';
      inp.inputMode   = 'decimal';
      inp.className   = `m-cell${m === 'b' ? ' cell-b' : ''}`;
      inp.dataset.row = r;
      inp.dataset.col = c;
      inp.dataset.mat = m;
      inp.placeholder = '0';
      inp.autocomplete = 'off';

      inp.addEventListener('keydown',  e => onCellKey(e, m, rows, cols));
      inp.addEventListener('input',    e => onCellInput(e, m));
      inp.addEventListener('focus',    () => inp.select());
      inp.addEventListener('paste',    e => onCellPaste(e, m));

      grid.appendChild(inp);
    }
  }
}

// ── Cell keydown: validate + navigate ───────────
function onCellKey(e, m, rows, cols) {
  const inp = e.target;
  const val = inp.value;
  const sel = inp.selectionStart;

  // Navigation keys
  if (e.key === 'Tab') {
    e.preventDefault();
    navigate(inp, m, rows, cols, e.shiftKey ? -1 : 1, 0);
    return;
  }
  if (e.key === 'Enter') {
    e.preventDefault();
    navigate(inp, m, rows, cols, 0, 1);
    return;
  }
  if (e.key === 'ArrowRight') { e.preventDefault(); navigate(inp, m, rows, cols, 1, 0); return; }
  if (e.key === 'ArrowLeft')  { e.preventDefault(); navigate(inp, m, rows, cols, -1, 0); return; }
  if (e.key === 'ArrowDown')  { e.preventDefault(); navigate(inp, m, rows, cols, 0, 1); return; }
  if (e.key === 'ArrowUp')    { e.preventDefault(); navigate(inp, m, rows, cols, 0, -1); return; }

  // Allow control keys
  if (e.key === 'Backspace' || e.key === 'Delete' ||
      e.key === 'Home' || e.key === 'End') return;
  if (e.ctrlKey || e.metaKey) return;

  // Allow digits
  if (/^\d$/.test(e.key)) return;

  // Allow one leading minus
  if (e.key === '-') {
    if (sel === 0 && !val.includes('-')) return;
    e.preventDefault();
    shakeCell(inp);
    return;
  }

  // Allow one decimal point
  if (e.key === '.') {
    if (!val.includes('.')) return;
    e.preventDefault();
    shakeCell(inp);
    return;
  }

  // Reject everything else
  e.preventDefault();
  shakeCell(inp);
}

// ── Cell input: clean up (handles paste/autofill) ─
function onCellInput(e, m) {
  const inp = e.target;
  let v = inp.value;

  // Strip invalid chars
  let cleaned = v.replace(/[^\d.\-]/g, '');

  // Ensure minus only at position 0
  if (cleaned.includes('-')) {
    const hasMinus = cleaned.startsWith('-');
    cleaned = (hasMinus ? '-' : '') + cleaned.replace(/-/g, '');
  }

  // Ensure single decimal
  const dotIdx = cleaned.indexOf('.');
  if (dotIdx !== -1) {
    cleaned = cleaned.slice(0, dotIdx + 1) + cleaned.slice(dotIdx + 1).replace(/\./g, '');
  }

  if (cleaned !== v) {
    inp.value = cleaned;
    if (v !== '') shakeCell(inp);
  }

  const done = cleaned !== '' && cleaned !== '-' && cleaned !== '.' && cleaned !== '-.' && !isNaN(Number(cleaned));
  inp.classList.toggle('filled', done);
  checkReady(m);
}

// ── Handle paste ─────────────────────────────────
function onCellPaste(e, m) {
  e.preventDefault();
  const text = (e.clipboardData || window.clipboardData).getData('text');
  const num  = text.trim().replace(/[^\d.\-]/g, '');
  if (!isNaN(Number(num)) && num !== '') {
    e.target.value = num;
    onCellInput({ target: e.target }, m);
  }
}

// ── Arrow navigation ──────────────────────────────
function navigate(inp, m, rows, cols, dc, dr) {
  const r   = parseInt(inp.dataset.row);
  const c   = parseInt(inp.dataset.col);
  let nr = r + dr;
  let nc = c + dc;

  // Wrap left/right across rows
  if (dr === 0) {
    if (nc < 0)    { nc = cols - 1; nr = r - 1; }
    if (nc >= cols){ nc = 0;        nr = r + 1; }
  }

  nr = Math.max(0, Math.min(rows - 1, nr));
  nc = Math.max(0, Math.min(cols - 1, nc));

  const all = $(`grid-${m}`).querySelectorAll('.m-cell');
  const target = all[nr * cols + nc];
  if (target) { target.focus(); target.select(); }
}

function shakeCell(inp) {
  inp.classList.remove('shake');
  void inp.offsetWidth; // reflow to restart animation
  inp.classList.add('shake');
  setTimeout(() => inp.classList.remove('shake'), 400);
}

function checkReady(m) {
  const cells = $(`grid-${m}`).querySelectorAll('.m-cell');
  const all   = Array.from(cells).every(c => {
    const v = c.value.trim();
    return v !== '' && v !== '-' && !isNaN(Number(v));
  });
  $(`ready-${m}`).classList.toggle('show', all);
}

function getMatrix(m) {
  const { rows, cols } = S.dims[m];
  const cells = $(`grid-${m}`).querySelectorAll('.m-cell');
  const out   = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      const v = parseFloat(cells[r * cols + c].value);
      row.push(isNaN(v) ? 0 : v);
    }
    out.push(row);
  }
  return out;
}

function validateAllCells() {
  let ok = true;
  ['a', 'b'].forEach(m => {
    const cells = $(`grid-${m}`).querySelectorAll('.m-cell');
    cells.forEach(inp => {
      const v = inp.value.trim();
      if (v === '' || v === '-' || isNaN(Number(v))) {
        shakeCell(inp);
        ok = false;
      }
    });
  });
  return ok;
}

function proceedToOps() {
  if (!validateAllCells()) return;
  goToStage(3);
}

// ══════════════════════════════════════════════════
//  RANDOM FILL
// ══════════════════════════════════════════════════
function randomFill(m) {
  const cells = $(`grid-${m}`).querySelectorAll('.m-cell');
  cells.forEach((inp, i) => {
    const v = Math.floor(Math.random() * 19) - 9; // -9 to 9
    inp.value = v;
    inp.classList.add('filled');
    // Staggered pop animation
    setTimeout(() => {
      inp.style.transition = 'transform .12s';
      inp.style.transform  = 'scale(1.15)';
      setTimeout(() => { inp.style.transform = 'scale(1)'; }, 120);
    }, i * 22);
  });
  checkReady(m);
}

// ══════════════════════════════════════════════════
//  OPERATION SELECTION
// ══════════════════════════════════════════════════
function pickOp(op) {
  S.op = op;
  document.querySelectorAll('.op-card').forEach(c =>
    c.classList.toggle('selected', c.dataset.op === op)
  );
  $('btn-execute').disabled = false;
}

// ══════════════════════════════════════════════════
//  EXECUTE — API CALL
// ══════════════════════════════════════════════════
async function runOperation() {
  if (!S.op) return;

  const btn  = $('btn-execute');
  const spin = $('exec-spin');
  btn.disabled = true;
  spin.classList.remove('hidden');

  $('result-panel').classList.add('hidden');
  $('err-panel').classList.add('hidden');

  const body = {
    operation: S.op,
    matrix_a:  getMatrix('a'),
    matrix_b:  getMatrix('b')
  };

  try {
    const res  = await fetch('/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();

    if (data.success) {
      S.lastResult = data.result;
      renderResult(data.result);
      pushHistory(S.op, data.result, null);
    } else {
      showError(data.error || 'Unknown error');
      pushHistory(S.op, null, data.error);
    }
  } catch (err) {
    const msg = 'Cannot reach the server. Make sure Flask is running (python app.py).';
    showError(msg);
    pushHistory(S.op, null, msg);
  } finally {
    btn.disabled = false;
    spin.classList.add('hidden');
  }
}

// ══════════════════════════════════════════════════
//  RESULT RENDERING
// ══════════════════════════════════════════════════
function renderResult(r) {
  const label = $('res-label');
  const shape = $('res-shape');
  const body  = $('res-body');
  body.innerHTML = '';

  const opLabels = {
    add: 'A + B', subtract: 'A − B', multiply: 'A × B',
    transpose: 'Transpose', determinant: 'Determinant',
    inverse: 'Inverse', rank_trace: 'Rank & Trace'
  };
  label.textContent = `✓  ${opLabels[S.op] || r.label}`;

  if (r.type === 'matrix') {
    shape.textContent = r.shape ? r.shape.replace('x', '×') : '';
    const wrap = document.createElement('div');
    wrap.className = 'res-matrices';
    wrap.appendChild(buildResMatrix(r.data, 'RESULT'));
    body.appendChild(wrap);

  } else if (r.type === 'transpose') {
    shape.textContent = 'Aᵀ and Bᵀ';
    const wrap = document.createElement('div');
    wrap.className = 'res-matrices';
    if (r.data_a) wrap.appendChild(buildResMatrix(r.data_a, `Aᵀ  (${r.shape_a ? r.shape_a.replace('x','×') : ''})`));
    if (r.data_b) wrap.appendChild(buildResMatrix(r.data_b, `Bᵀ  (${r.shape_b ? r.shape_b.replace('x','×') : ''})`));
    body.appendChild(wrap);

  } else if (r.type === 'determinant') {
    shape.textContent = '';
    const wrap = document.createElement('div');
    wrap.className = 'det-wrap';
    wrap.appendChild(buildDetCard('det ( A )', r.det_a, r.err_a));
    wrap.appendChild(buildDetCard('det ( B )', r.det_b, r.err_b));
    body.appendChild(wrap);

  } else if (r.type === 'inverse') {
    shape.textContent = 'A⁻¹ and B⁻¹';
    const wrap = document.createElement('div');
    wrap.className = 'res-matrices';
    wrap.appendChild(buildResMatrixOrError(r.data_a, `A⁻¹`, r.err_a));
    if (r.data_b || r.err_b) {
      wrap.appendChild(buildResMatrixOrError(r.data_b, `B⁻¹`, r.err_b));
    }
    body.appendChild(wrap);

  } else if (r.type === 'rank_trace') {
    shape.textContent = '';
    const wrap = document.createElement('div');
    wrap.className = 'rank-trace-wrap';
    wrap.appendChild(buildRankTraceCard('MATRIX A', r.rank_a, r.trace_a, r.err_trace_a));
    if (r.rank_b !== null && r.rank_b !== undefined) {
      wrap.appendChild(buildRankTraceCard('MATRIX B', r.rank_b, r.trace_b, r.err_trace_b));
    }
    body.appendChild(wrap);
  }

  $('result-panel').classList.remove('hidden');
}

function buildRankTraceCard(title, rank, trace, errTrace) {
  const card = document.createElement('div');
  card.className = 'rt-card';

  const t = document.createElement('div');
  t.className = 'rt-title';
  t.textContent = title;
  card.appendChild(t);

  const rDiv = document.createElement('div');
  rDiv.className = 'rt-row';
  rDiv.innerHTML = `<span class="rt-lbl">RANK</span><span class="rt-val">${rank}</span>`;
  card.appendChild(rDiv);

  const trDiv = document.createElement('div');
  trDiv.className = 'rt-row';
  if (errTrace) {
    trDiv.innerHTML = `<span class="rt-lbl">TRACE</span><span class="rt-err">${errTrace}</span>`;
  } else {
    trDiv.innerHTML = `<span class="rt-lbl">TRACE</span><span class="rt-val">${formatNum(trace)}</span>`;
  }
  card.appendChild(trDiv);
  return card;
}

function buildResMatrix(data, title) {
  return buildResMatrixOrError(data, title, null);
}

function buildResMatrixOrError(data, title, error) {
  const block = document.createElement('div');
  block.className = 'res-matrix-block';

  const t = document.createElement('div');
  t.className = 'res-matrix-title';
  t.textContent = title;
  block.appendChild(t);

  if (error) {
    const errCard = document.createElement('div');
    errCard.className = 'matrix-err-card';
    errCard.textContent = error;
    block.appendChild(errCard);
    return block;
  }

  if (!data || !data.length) return block;

  const cols   = data[0].length;
  const flat   = data.flat();
  const maxAbs = Math.max(...flat.map(Math.abs), 1);

  const grid = document.createElement('div');
  grid.className = 'res-grid';
  grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

  flat.forEach((val, idx) => {
    const cell = document.createElement('div');
    cell.className = 'res-cell';

    if (val > 0) {
      cell.classList.add('pos');
      const intensity = Math.abs(val) / maxAbs;
      cell.style.background = `rgba(16,185,129,${0.06 + intensity * 0.22})`;
    } else if (val < 0) {
      cell.classList.add('neg');
      const intensity = Math.abs(val) / maxAbs;
      cell.style.background = `rgba(239,68,68,${0.06 + intensity * 0.22})`;
    } else {
      cell.classList.add('zer');
    }

    cell.textContent = formatNum(val);
    grid.appendChild(cell);

    // Cascade reveal
    setTimeout(() => cell.classList.add('reveal'), idx * 35);
  });

  block.appendChild(grid);
  return block;
}

function buildDetCard(lbl, val, err) {
  const card = document.createElement('div');
  card.className = 'det-card';

  const l = document.createElement('div');
  l.className = 'det-label';
  l.textContent = lbl;
  card.appendChild(l);

  const v = document.createElement('div');
  if (err) {
    v.className = 'det-err';
    v.textContent = err;
  } else {
    v.className = 'det-val';
    v.textContent = '0';
    if (val !== null && val !== undefined) {
      animateCounter(v, val);
    } else {
      v.textContent = '—';
    }
  }
  card.appendChild(v);
  return card;
}

function animateCounter(el, target) {
  const duration = 900;
  const start    = performance.now();
  const isInt    = Number.isInteger(target);

  function tick(now) {
    const p    = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3); // cubic ease-out
    const cur  = target * ease;
    el.textContent = isInt ? Math.round(cur) : cur.toFixed(4);
    if (p < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = formatNum(target);
    }
  }
  requestAnimationFrame(tick);
}

function showError(msg) {
  $('err-msg').textContent = msg;
  $('err-panel').classList.remove('hidden');
}

// ══════════════════════════════════════════════════
//  COPY RESULT
// ══════════════════════════════════════════════════
function copyResult() {
  if (!S.lastResult) return;
  let text = '';
  const r  = S.lastResult;

  function matrixToText(data) {
    return data.map(row => row.map(v => formatNum(v).padStart(10)).join('')).join('\n');
  }

  if (r.type === 'matrix')      text = matrixToText(r.data);
  else if (r.type === 'transpose') {
    text = 'Transpose A:\n' + matrixToText(r.data_a);
    if (r.data_b) text += '\n\nTranspose B:\n' + matrixToText(r.data_b);
  } else if (r.type === 'determinant') {
    if (r.det_a !== null && r.det_a !== undefined) text += `det(A) = ${formatNum(r.det_a)}\n`;
    if (r.err_a) text += `det(A) = ERROR: ${r.err_a}\n`;
    if (r.det_b !== null && r.det_b !== undefined) text += `det(B) = ${formatNum(r.det_b)}`;
    if (r.err_b) text += `det(B) = ERROR: ${r.err_b}`;
  } else if (r.type === 'inverse') {
    if (r.data_a) text += 'Inverse A:\n' + matrixToText(r.data_a);
    if (r.err_a) text += 'Inverse A = ERROR: ' + r.err_a;
    if (r.data_b || r.err_b) {
      text += '\n\n';
      if (r.data_b) text += 'Inverse B:\n' + matrixToText(r.data_b);
      if (r.err_b) text += 'Inverse B = ERROR: ' + r.err_b;
    }
  } else if (r.type === 'rank_trace') {
    text += `Matrix A:\nRank = ${r.rank_a}\nTrace = ${r.trace_a !== null && r.trace_a !== undefined ? formatNum(r.trace_a) : 'ERROR: ' + r.err_trace_a}`;
    if (r.rank_b !== null && r.rank_b !== undefined) {
      text += `\n\nMatrix B:\nRank = ${r.rank_b}\nTrace = ${r.trace_b !== null && r.trace_b !== undefined ? formatNum(r.trace_b) : 'ERROR: ' + r.err_trace_b}`;
    }
  }

  const btn  = $('btn-copy');
  const orig = btn.textContent;

  const tryClipboard = () => {
    navigator.clipboard.writeText(text).then(() => {
      btn.textContent = '✓ COPIED';
      setTimeout(() => { btn.textContent = orig; }, 1500);
    }).catch(fallback);
  };

  const fallback = () => {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'absolute';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      btn.textContent = '✓ COPIED';
      setTimeout(() => { btn.textContent = orig; }, 1500);
    } catch (_) {}
    document.body.removeChild(ta);
  };

  if (navigator.clipboard) {
    tryClipboard();
  } else {
    fallback();
  }
}

// ══════════════════════════════════════════════════
//  HISTORY
// ══════════════════════════════════════════════════
const OP_NAMES = {
  add: 'ADD (A + B)', subtract: 'SUBTRACT (A - B)',
  multiply: 'MULTIPLY (A × B)', transpose: 'TRANSPOSE',
  determinant: 'DETERMINANT', inverse: 'INVERSE',
  rank_trace: 'RANK & TRACE'
};

function pushHistory(op, result, error) {
  const now  = new Date();
  const time = now.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit', second:'2-digit' });
  const { rows:ar, cols:ac } = S.dims.a;
  const { rows:br, cols:bc } = S.dims.b;

  let detail = `A: ${ar}×${ac}   B: ${br}×${bc}`;
  if (result) {
    if (result.type === 'determinant') {
      if (result.det_a !== null && result.det_a !== undefined)
        detail += `\ndet(A) = ${formatNum(result.det_a)}`;
      if (result.det_b !== null && result.det_b !== undefined)
        detail += `\ndet(B) = ${formatNum(result.det_b)}`;
    } else if (result.type === 'inverse') {
      detail += `\nInverse computed`;
      if (result.err_a) detail += `\nErr A: ${result.err_a}`;
      if (result.err_b) detail += `\nErr B: ${result.err_b}`;
    } else if (result.type === 'rank_trace') {
      detail += `\nrk(A) = ${result.rank_a}`;
      if (result.trace_a !== null && result.trace_a !== undefined)
        detail += `   tr(A) = ${formatNum(result.trace_a)}`;
      if (result.rank_b !== null && result.rank_b !== undefined) {
        detail += `\nrk(B) = ${result.rank_b}`;
        if (result.trace_b !== null && result.trace_b !== undefined)
          detail += `   tr(B) = ${formatNum(result.trace_b)}`;
      }
    } else if (result.shape) {
      detail += `\nResult: ${result.shape.replace('x','×')}`;
    } else if (result.shape_a) {
      detail += `\nAᵀ: ${result.shape_a.replace('x','×')}`;
    }
  }

  S.history.unshift({ op, time, detail, error: error || null });
  $('log-count').textContent = S.history.length;
  renderHistory();
}

function renderHistory() {
  const body = $('hist-body');
  if (!S.history.length) {
    body.innerHTML = '<p class="hist-empty">No operations yet.<br>Results appear here.</p>';
    return;
  }
  body.innerHTML = '';
  S.history.forEach(item => {
    const el = document.createElement('div');
    el.className = 'hist-item';

    const timeDiv = document.createElement('div');
    timeDiv.className = 'hi-time';
    timeDiv.textContent = item.time;
    el.appendChild(timeDiv);

    const opDiv = document.createElement('div');
    opDiv.className = 'hi-op';
    opDiv.textContent = OP_NAMES[item.op] || item.op;
    el.appendChild(opDiv);

    const detDiv = document.createElement('div');
    detDiv.className = 'hi-det';
    const lines = item.detail.split('\n');
    lines.forEach((line, idx) => {
      if (idx > 0) detDiv.appendChild(document.createElement('br'));
      detDiv.appendChild(document.createTextNode(line));
    });
    el.appendChild(detDiv);

    const tagDiv = document.createElement('div');
    tagDiv.className = `hi-tag ${item.error ? 'hi-err' : 'hi-ok'}`;
    tagDiv.textContent = item.error ? '✗ ERROR' : '✓ SUCCESS';
    el.appendChild(tagDiv);

    body.appendChild(el);
  });
}

function clearHistory() {
  S.history = [];
  $('log-count').textContent = '0';
  renderHistory();
}

function toggleHistory() {
  S.histOpen = !S.histOpen;
  $('hist-panel').classList.toggle('open', S.histOpen);
  $('hist-backdrop').classList.toggle('hidden', !S.histOpen);
}

// ══════════════════════════════════════════════════
//  RESET
// ══════════════════════════════════════════════════
function resetAll() {
  S.op         = null;
  S.lastResult = null;
  S.dims       = { a: { rows: 3, cols: 3 }, b: { rows: 3, cols: 3 } };

  // Reset dimension label displays in Stage 1
  $('val-a-rows').textContent = 3;
  $('val-a-cols').textContent = 3;
  $('val-b-rows').textContent = 3;
  $('val-b-cols').textContent = 3;

  // Re-render dot preview grids
  renderDots('a');
  renderDots('b');

  // Re-render input grid templates
  buildGrid('a');
  buildGrid('b');

  // Reset stage 2 header dimension badges
  $('badge-a').textContent = '3×3';
  $('badge-b').textContent = '3×3';

  goToStage(1);
}

// ══════════════════════════════════════════════════
//  KEYBOARD SHORTCUTS
// ══════════════════════════════════════════════════
document.addEventListener('keydown', e => {
  // Ctrl+Enter → execute
  if (e.ctrlKey && e.key === 'Enter') {
    const btn = $('btn-execute');
    if (S.stage === 3 && !btn.disabled) runOperation();
  }
  // Escape → close history
  if (e.key === 'Escape' && S.histOpen) toggleHistory();
});

// ══════════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════════
window.addEventListener('load', () => {
  bootSequence();
});
