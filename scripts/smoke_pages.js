#!/usr/bin/env node
/**
 * Smoke-test the built site without a browser.
 *
 * Usage: node scripts/smoke_pages.js
 *
 * Runs dist/app.js against a minimal DOM stub once per page (index, browse,
 * topics), using the real dist/data.js, and reports what each page rendered.
 * It catches the failure this repo is most exposed to: app.js is one script
 * shared by three pages, so a selector that exists on only one of them throws
 * at load and the page comes up blank. A browser would show that immediately;
 * there is no browser here, so this stands in for one.
 *
 * It does not check layout or styling. It checks that each page's code path
 * runs to completion and produces the elements it is supposed to produce.
 *
 * Exits non-zero and prints the error if any page throws.
 */

const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, '..', 'dist');

// ---- A DOM small enough to read, large enough to run app.js ---------------

function makeNode(tag) {
  const node = {
    tagName: String(tag).toUpperCase(),
    children: [],
    attrs: {},
    _text: '',
    _html: '',
    style: {},
    hidden: false,
    disabled: false,
    value: '',
    classList: {
      _set: new Set(),
      add(...c) { c.forEach((x) => this._set.add(x)); },
      remove(...c) { c.forEach((x) => this._set.delete(x)); },
      toggle(c, on) { if (on === undefined) on = !this._set.has(c); on ? this._set.add(c) : this._set.delete(c); },
      contains(c) { return this._set.has(c); },
    },
    _listeners: {},
    appendChild(child) { this.children.push(child); child.parentNode = this; return child; },
    insertBefore(child, ref) {
      const at = ref ? this.children.indexOf(ref) : -1;
      at >= 0 ? this.children.splice(at, 0, child) : this.children.push(child);
      child.parentNode = this;
      return child;
    },
    removeChild(child) {
      const at = this.children.indexOf(child);
      if (at >= 0) this.children.splice(at, 1);
      return child;
    },
    setAttribute(k, v) { this.attrs[k] = String(v); },
    getAttribute(k) { return k in this.attrs ? this.attrs[k] : null; },
    hasAttribute(k) { return k in this.attrs; },
    removeAttribute(k) { delete this.attrs[k]; },
    addEventListener(type, fn) { (this._listeners[type] = this._listeners[type] || []).push(fn); },
    scrollIntoView() {},
    focus() {},
    // Depth-first walk, used by the query helpers and the counters below.
    walk(visit) {
      for (const c of this.children) { visit(c); c.walk(visit); }
    },
    querySelector(sel) { return this.querySelectorAll(sel)[0] || null; },
    querySelectorAll(sel) {
      const hits = [];
      const match = selectorMatcher(sel);
      this.walk((n) => { if (match(n)) hits.push(n); });
      hits.forEach = Array.prototype.forEach.bind(hits);
      return hits;
    },
  };
  // Real elements expose both; app.js uses childNodes to test "already filled".
  Object.defineProperty(node, 'childNodes', { get() { return node.children; } });
  Object.defineProperty(node, 'firstChild', { get() { return node.children[0] || null; } });
  Object.defineProperty(node, 'className', {
    get() { return [...node.classList._set].join(' '); },
    set(v) { node.classList._set = new Set(String(v).split(/\s+/).filter(Boolean)); },
  });
  Object.defineProperty(node, 'textContent', {
    get() { return node._text; },
    set(v) { node._text = String(v); node.children.length = 0; },
  });
  Object.defineProperty(node, 'innerHTML', {
    get() { return node._html; },
    set(v) { node._html = String(v); node.children.length = 0; },
  });
  return node;
}

/** Supports the selector shapes app.js actually uses. */
function selectorMatcher(sel) {
  sel = sel.trim();
  let m;
  if ((m = sel.match(/^\[([\w-]+)="([^"]*)"\]$/))) return (n) => n.getAttribute(m[1]) === m[2];
  if ((m = sel.match(/^\.([\w-]+)$/))) return (n) => n.classList.contains(m[1]);
  if ((m = sel.match(/^#([\w-]+)$/))) return (n) => n.attrs.id === m[1];
  if (/^[a-zA-Z]+$/.test(sel)) return (n) => n.tagName === sel.toUpperCase();
  return () => false;
}

function makeDocument(html) {
  const root = makeNode('html');
  const body = makeNode('body');
  root.appendChild(body);

  // Create a stub for every id="..." in the page source, so getElementById
  // finds the same elements the real page would have.
  // Carry over the `hidden` attribute: the modal starts hidden in the markup,
  // and a test that ignored that would pass whether or not the modal opened.
  const byId = new Map();
  for (const m of html.matchAll(/<[^>]*\bid="([^"]+)"[^>]*>/g)) {
    const el = makeNode('div');
    el.setAttribute('id', m[1]);
    el.hidden = /\shidden(\s|>|=)/.test(m[0]);
    byId.set(m[1], el);
    body.appendChild(el);
  }
  const pageMatch = html.match(/<body data-page="([^"]+)"/);
  if (pageMatch) body.setAttribute('data-page', pageMatch[1]);

  // The nav links are real elements app.js looks up by [data-nav="..."].
  for (const [, nav] of html.matchAll(/data-nav="([^"]+)"/g)) {
    const a = makeNode('a');
    a.setAttribute('data-nav', nav);
    body.appendChild(a);
  }

  return {
    body,
    createElement: makeNode,
    createTextNode: (t) => { const n = makeNode('#text'); n.textContent = t; return n; },
    getElementById: (id) => byId.get(id) || null,
    querySelector: (s) => root.querySelector(s),
    querySelectorAll: (s) => root.querySelectorAll(s),
    addEventListener() {},
  };
}

// ---- Run one page ---------------------------------------------------------

function runPage(name, query) {
  const html = fs.readFileSync(path.join(DIST, `${name}.html`), 'utf8');
  const document = makeDocument(html);
  const url = `https://example.test/${name}.html${query || ''}`;

  const sandbox = {
    document,
    window: {
      location: { href: url },
      history: { pushState() {}, replaceState() {}, back() {} },
      addEventListener() {},
      scrollTo() {},
    },
    URL,
    URLSearchParams,
    setTimeout: (fn) => { fn(); return 0; },
    clearTimeout() {},
    console,
    Date,
    Math,
    encodeURIComponent,
    decodeURIComponent,
    parseInt,
    JSON,
    Number,
    String,
    Object,
    Array,
  };
  sandbox.window.window = sandbox.window;
  sandbox.window.document = document;

  // data.js assigns to window.IDEAS_DATA; app.js reads it.
  const dataSrc = fs.readFileSync(path.join(DIST, 'data.js'), 'utf8');
  const appSrc = fs.readFileSync(path.join(DIST, 'app.js'), 'utf8');

  const names = Object.keys(sandbox);
  const run = new Function(...names, `${dataSrc}\n;\n${appSrc}`);
  run(...names.map((k) => sandbox[k]));

  // What did it build?
  const counts = { card: 0, chip: 0, topiccard: 0, section: 0, jumpbarLink: 0, pagerBtn: 0 };
  document.body.walk((n) => {
    if (n.classList.contains('card')) counts.card += 1;
    if (n.classList.contains('chip')) counts.chip += 1;
    if (n.classList.contains('topiccard')) counts.topiccard += 1;
    if (n.classList.contains('section')) counts.section += 1;
    if (n.classList.contains('jumpbar__link')) counts.jumpbarLink += 1;
    if (n.classList.contains('pager__btn')) counts.pagerBtn += 1;
  });
  counts.modalOpen = document.getElementById('modal').hidden === false;
  counts.resultText = document.getElementById('result-count')
    ? document.getElementById('result-count').textContent : '';
  counts.title = document.getElementById('browse-title')
    ? document.getElementById('browse-title').textContent : '';
  return counts;
}

// ---- Expectations --------------------------------------------------------

const EXPECT = {
  index: (c) => c.section >= 3 && c.card > 0 && c.jumpbarLink > 0,
  browse: (c) => c.card > 0 && c.chip > 0 && c.pagerBtn > 0,
  topics: (c) => c.topiccard > 0,
};

// Scenarios that exercise what was actually added: filtering from the query
// string, and the deep link that makes the back button and sharing work.
const SCENARIOS = [
  { name: 'browse ?topic=music-and-audio', page: 'browse', query: '?topic=music-and-audio',
    check: (c) => c.card === 9 && c.title === 'Music & Audio',
    why: 'expected the 9 Music & Audio ideas and a topic heading' },
  { name: 'browse ?q=chess', page: 'browse', query: '?q=chess',
    check: (c) => c.card > 0 && c.card < 24, why: 'expected a narrowed set of search hits' },
  { name: 'browse ?for=more&page=2', page: 'browse', query: '?for=more&page=2',
    check: (c) => c.card === 24 && /page 2 of/.test(c.resultText), why: 'expected a full second page' },
  { name: 'browse ?q=zzzznomatch', page: 'browse', query: '?q=zzzznomatch',
    check: (c) => c.card === 0, why: 'expected no cards' },
  { name: 'index ?idea=<first>', page: 'index', query: null, deepLink: true,
    check: (c) => c.modalOpen, why: 'expected a shared idea link to open its modal' },
];

let failures = 0;
for (const page of ['index', 'browse', 'topics']) {
  try {
    const counts = runPage(page);
    const ok = EXPECT[page](counts);
    if (!ok) failures += 1;
    const detail = Object.entries(counts)
      .filter(([, v]) => v > 0)
      .map(([k, v]) => `${k} ${v}`)
      .join(', ') || 'nothing rendered';
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${page.padEnd(7)} ${detail}`);
  } catch (err) {
    failures += 1;
    console.log(`FAIL  ${page.padEnd(7)} threw: ${err.message}`);
    if (process.env.VERBOSE) console.log(err.stack);
  }
}

// The deep-link scenario needs a real idea id out of the built data.
const built = JSON.parse((() => {
  const raw = fs.readFileSync(path.join(DIST, 'data.js'), 'utf8');
  return raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1);
})());
const firstId = built.ideas.filter((i) => !i.placeholder)[0].id;

// The public data must carry no working notes: those ship only in
// dist/notes/data.js, behind the password (netlify/edge-functions/notes-auth.js).
const PRIVATE_KEYS = ['scores', 'scoreRationale', 'problemEvidence', 'competitors', 'pricing',
  'revenueSketch', 'distribution', 'validationTest', 'moat', 'review', 'gateGap', 'confidence',
  'whyNow', 'founderFit', 'buyer', 'risks', 'complexity', 'tierKey'];
const leaked = built.ideas.filter((i) => PRIVATE_KEYS.some((k) => k in i) ||
  (i.mvpScope && ('buildEstimate' in i.mvpScope || 'outOfScope' in i.mvpScope)));
const notesRaw = fs.readFileSync(path.join(DIST, 'notes', 'data.js'), 'utf8');
const leakOk = leaked.length === 0 && notesRaw.includes('"scores"');
if (!leakOk) failures += 1;
console.log(`${leakOk ? 'PASS' : 'FAIL'}  public data has no working notes (${leaked.length} leaking), notes data keeps them`);

console.log('');
for (const s of SCENARIOS) {
  const query = s.deepLink ? `?idea=${encodeURIComponent(firstId)}` : s.query;
  try {
    const counts = runPage(s.page, query);
    const ok = s.check(counts);
    if (!ok) failures += 1;
    const detail = ok ? `card ${counts.card}` : `${s.why}; got card ${counts.card}, ` +
      `title ${JSON.stringify(counts.title)}, modal ${counts.modalOpen}`;
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${s.name.padEnd(30)} ${detail}`);
  } catch (err) {
    failures += 1;
    console.log(`FAIL  ${s.name.padEnd(30)} threw: ${err.message}`);
    if (process.env.VERBOSE) console.log(err.stack);
  }
}

if (failures) {
  console.log(`\n${failures} page(s) failed. Run with VERBOSE=1 for stack traces.`);
  process.exit(1);
}
console.log('\nOK: all pages rendered and all scenarios passed.');
