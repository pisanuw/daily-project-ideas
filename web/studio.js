/* HintWise Studio: the little the studio pages do in the browser.
   - Demo videos stop for visitors who ask for reduced motion.
   - The Apps page filters by audience (?for=) and by a search box (?q=).
   Without this script every app is still listed and every link works. */
(function () {
  'use strict';

  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  function settleVideos() {
    if (!still || !still.matches) return;
    document.querySelectorAll('video[autoplay]').forEach(function (v) {
      v.removeAttribute('autoplay');
      v.pause();
      v.currentTime = 0;
    });
  }
  settleVideos();
  if (still && still.addEventListener) still.addEventListener('change', settleVideos);

  var grid = document.getElementById('appgrid');
  var bar = document.getElementById('appbar');
  if (!grid || !bar) return;

  var cards = Array.prototype.slice.call(grid.querySelectorAll('.app-card'));
  var buttons = Array.prototype.slice.call(bar.querySelectorAll('[data-for]'));
  var box = document.getElementById('app-q');
  var count = document.getElementById('app-count');
  var none = document.getElementById('app-none');
  var labels = {};
  buttons.forEach(function (b) { labels[b.getAttribute('data-for')] = b.textContent; });

  function state() {
    var p = new URL(window.location.href).searchParams;
    var f = p.get('for') || '';
    return { for: Object.prototype.hasOwnProperty.call(labels, f) ? f : '', q: p.get('q') || '' };
  }

  function apply(s) {
    var words = s.q.toLowerCase().split(/\s+/).filter(Boolean);
    var shown = 0;
    cards.forEach(function (c) {
      var aud = ' ' + c.getAttribute('data-aud') + ' ';
      var text = c.getAttribute('data-text');
      var ok = (!s.for || aud.indexOf(' ' + s.for + ' ') >= 0) &&
        words.every(function (w) { return text.indexOf(w) >= 0; });
      c.hidden = !ok;
      if (ok) shown += 1;
    });
    buttons.forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-for') === s.for));
    });
    if (box.value !== s.q) box.value = s.q;
    count.textContent = shown + (shown === 1 ? ' app' : ' apps') +
      (s.for ? ' for ' + labels[s.for].toLowerCase() : '') +
      (s.q ? ' matching “' + s.q + '”' : '');
    none.hidden = shown > 0;
  }

  function update(changes, replace) {
    var url = new URL(window.location.href);
    Object.keys(changes).forEach(function (k) {
      if (changes[k]) url.searchParams.set(k, changes[k]); else url.searchParams.delete(k);
    });
    window.history[replace ? 'replaceState' : 'pushState'](null, '', url);
    apply(state());
  }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () { update({ for: b.getAttribute('data-for') }); });
  });
  var timer = null;
  box.addEventListener('input', function () {
    clearTimeout(timer);
    timer = setTimeout(function () { update({ q: box.value.trim() }, true); }, 150);
  });
  window.addEventListener('popstate', function () { apply(state()); });

  bar.hidden = false;
  apply(state());
})();
