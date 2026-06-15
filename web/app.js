/* global window, document */
(function () {
  'use strict';

  var DATA = window.IDEAS_DATA || { meta: {}, tiers: [], ideas: [] };
  var INITIAL = 3; // latest N shown per tier before the fold

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === 'class') node.className = attrs[k];
        else if (k === 'text') node.textContent = attrs[k];
        else if (k === 'html') node.innerHTML = attrs[k];
        else node.setAttribute(k, attrs[k]);
      });
    }
    (children || []).forEach(function (c) {
      if (c) node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  }

  function byDateDesc(a, b) {
    if (a.date === b.date) return (b.n || 0) - (a.n || 0);
    return a.date < b.date ? 1 : -1;
  }

  function peppersFor(tierKey) {
    var t = DATA.tiers.filter(function (x) { return x.key === tierKey; })[0];
    return t ? t.peppers : '';
  }

  // ---- Hero ----
  function renderHero() {
    var m = DATA.meta || {};
    document.getElementById('tagline').textContent = m.tagline || '';
    document.getElementById('description').textContent = m.description || '';
    var live = DATA.ideas.filter(function (i) { return !i.placeholder; }).length;
    var when = DATA.generatedAt ? new Date(DATA.generatedAt).toLocaleDateString(undefined, {
      year: 'numeric', month: 'long', day: 'numeric'
    }) : '';
    document.getElementById('hero-meta').textContent =
      live + ' ideas and counting · last updated ' + when;
  }

  // ---- Card ----
  function card(idea) {
    var tags = [el('span', { class: 'tag tag--date', text: idea.date })];
    if (idea.category) tags.push(el('span', { class: 'tag', text: idea.category }));
    if (idea.implemented && idea.url) tags.push(el('span', { class: 'tag tag--live', text: 'Live ↗' }));

    var node = el('button', { class: 'card', type: 'button' }, [
      el('div', { class: 'card__top' }, [
        el('h3', { class: 'card__title', text: idea.title }),
        el('span', { class: 'card__peppers', text: peppersFor(idea.tierKey) }),
      ]),
      el('p', { class: 'card__summary', text: idea.summary || '' }),
      el('div', { class: 'card__foot' }, tags),
    ]);
    node.addEventListener('click', function () { openModal(idea); });
    return node;
  }

  // ---- Section ----
  function section(tier, ideas) {
    var sorted = ideas.slice().sort(byDateDesc);
    var head = el('div', { class: 'section__head' }, [
      el('span', { class: 'section__peppers', text: tier.peppers }),
      el('h2', { class: 'section__title', text: tier.label }),
      el('span', { class: 'section__count', text: sorted.length + (sorted.length === 1 ? ' project' : ' projects') }),
      el('p', { class: 'section__blurb', text: tier.blurb }),
    ]);

    var grid = el('div', { class: 'grid' });
    var sec = el('section', { class: 'section', 'data-tier': tier.key }, [head, grid]);

    if (sorted.length === 0) {
      grid.appendChild(el('p', { class: 'empty', text: 'Nothing here yet. Check back soon.' }));
      return sec;
    }

    var latest = sorted.slice(0, INITIAL);
    var rest = sorted.slice(INITIAL);
    latest.forEach(function (i) { grid.appendChild(card(i)); });

    if (rest.length > 0) {
      var hiddenCards = rest.map(function (i) {
        var c = card(i);
        c.classList.add('hidden');
        return c;
      });
      hiddenCards.forEach(function (c) { grid.appendChild(c); });

      var btn = el('button', { class: 'fold-btn', type: 'button' });
      var expanded = false;
      function syncLabel() {
        btn.textContent = expanded
          ? '▲ Show fewer'
          : '▼ Show all ' + sorted.length + ' ' + tier.label.toLowerCase() + ' projects (' + rest.length + ' more)';
      }
      btn.addEventListener('click', function () {
        expanded = !expanded;
        hiddenCards.forEach(function (c) { c.classList.toggle('hidden', !expanded); });
        syncLabel();
      });
      syncLabel();
      sec.appendChild(btn);
    }
    return sec;
  }

  function renderSections() {
    var host = document.getElementById('sections');
    DATA.tiers.forEach(function (tier) {
      var ideas = DATA.ideas.filter(function (i) { return i.tierKey === tier.key; });
      // Hide a tier only if it's the special implemented tier and empty.
      if (tier.key === 'implemented' && ideas.length === 0) return;
      host.appendChild(section(tier, ideas));
    });
  }

  // ---- Modal ----
  var modal = document.getElementById('modal');
  var modalBody = document.getElementById('modal-body');

  function detailSection(title, bodyNode) {
    if (!bodyNode) return null;
    return el('div', { class: 'detail-block' }, [el('h3', { text: title }), bodyNode]);
  }

  function openModal(idea) {
    modalBody.innerHTML = '';
    var tags = [];
    if (idea.complexity) tags.push(el('span', { class: 'tag', text: idea.complexity }));
    if (idea.category) tags.push(el('span', { class: 'tag', text: idea.category }));
    tags.push(el('span', { class: 'tag tag--date', text: idea.date }));

    var frag = el('div', { class: 'detail' }, [
      el('div', { class: 'detail__peppers', text: peppersFor(idea.tierKey) }),
      el('h2', { class: 'detail__title', id: 'modal-title', text: idea.title }),
      el('div', { class: 'detail__tags' }, tags),
    ]);

    if (idea.description) frag.appendChild(detailSection('Description', el('p', { text: idea.description })));
    if (idea.notes) frag.appendChild(detailSection('Notes', el('p', { text: idea.notes })));

    if (idea.keyFeatures && idea.keyFeatures.length) {
      var ul = el('ul', {}, idea.keyFeatures.map(function (f) { return el('li', { text: f }); }));
      frag.appendChild(detailSection('Key Features', ul));
    }
    if (idea.techStack) frag.appendChild(detailSection('Suggested Tech Stack', el('p', { text: idea.techStack })));
    if (idea.whyInteresting) frag.appendChild(detailSection("Why It's Interesting", el('p', { text: idea.whyInteresting })));
    if (idea.inspiredBy) frag.appendChild(detailSection('Inspired By', el('p', { class: 'inspired', text: idea.inspiredBy })));

    var links = [];
    if (idea.url) links.push(el('a', { class: 'btn-link', href: idea.url, target: '_blank', rel: 'noopener', text: 'View live project ↗' }));
    if (idea.repo) links.push(el('a', { class: 'btn-link btn-link--ghost', href: idea.repo, target: '_blank', rel: 'noopener', text: 'Source code ↗' }));
    if (links.length) frag.appendChild(el('div', { class: 'detail__links' }, links));

    modalBody.appendChild(frag);
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  modal.addEventListener('click', function (e) {
    if (e.target.hasAttribute('data-close')) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });

  // ---- Go ----
  renderHero();
  renderSections();
})();
