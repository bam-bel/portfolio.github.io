/* Phase 3–4: Operating Mode restructure + project standardization */
(function () {
  'use strict';

  function injectStyles() {
    if (document.getElementById('phase34-style')) return;
    var style = document.createElement('style');
    style.id = 'phase34-style';
    style.textContent = `
      .phase34-operating{padding-top:0!important}
      .phase34-operating .head{margin-bottom:28px!important}
      .phase34-mode-copy{max-width:54ch!important;color:var(--muted)!important}
      .phase34-capabilities{display:flex;gap:22px;flex-wrap:wrap;margin-top:34px;align-items:baseline}
      .phase34-capabilities .eyebrow{margin-right:8px}
      .phase34-capabilities a{font:800 12px 'Montserrat',sans-serif!important;text-transform:uppercase;letter-spacing:.02em;color:var(--stone);transition:color .2s ease}
      .phase34-capabilities a:hover,.phase34-capabilities a:focus-visible{color:#38bdf8}
      .phase34-filters{display:flex;gap:20px;flex-wrap:wrap;align-items:center;margin-top:38px;padding-top:10px}
      .phase34-filters .filter{padding:0!important;font:800 10px 'Montserrat',sans-serif!important;letter-spacing:.03em}
      .phase34-filters .filter.active,.phase34-filters .filter:hover{background:transparent!important;color:#38bdf8!important}
      .phase34-project-meta{display:flex;gap:12px;flex-wrap:wrap;align-items:baseline;margin-top:12px}
      .phase34-project-meta .phase34-type{font:500 10px var(--fm);letter-spacing:.09em;text-transform:uppercase;color:rgba(255,255,255,.72)}
      .phase34-project-meta .phase34-status{font:500 9px var(--fm);letter-spacing:.08em;text-transform:uppercase;color:#38bdf8}
      .phase34-case-intro{display:grid;grid-template-columns:1.2fr .8fr;gap:48px;align-items:end;margin-bottom:40px}
      .phase34-case-label{font:800 10px 'Montserrat',sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#38bdf8}
      .phase34-case-copy{max-width:62ch;color:var(--muted)}
      .phase34-decision-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:1px;background:rgba(255,255,255,.08);margin-top:32px}
      .phase34-decision-grid .step{background:#0C121A;padding:26px 18px;border:0!important;min-width:0}
      .phase34-decision-grid .step b{font:800 10px 'JetBrains Mono',monospace;color:#38bdf8}
      .phase34-decision-grid .step strong{font-family:'Montserrat',sans-serif!important;font-weight:800!important}
      .phase34-metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(255,255,255,.08);margin-top:1px}
      .phase34-metrics .metric{border:0!important;background:#0C121A}
      .phase34-note{margin-top:24px;font:500 10px var(--fm);letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
      @media(max-width:900px){
        .phase34-capabilities{gap:14px 18px}
        .phase34-decision-grid{grid-template-columns:1fr 1fr}
        .phase34-metrics{grid-template-columns:1fr}
        .phase34-case-intro{grid-template-columns:1fr;gap:18px}
      }
    `;
    document.head.appendChild(style);
  }

  function moveFilterIntoOperatingMode() {
    var section = document.querySelector('.section:not(#work)');
    var filters = document.querySelector('.filters');
    if (!section || !filters || section.dataset.phase34) return;
    section.dataset.phase34 = '1';
    section.classList.add('phase34-operating');
    var head = section.querySelector('.head');
    var tdb = section.querySelector('.tdb');
    if (head) {
      var copy = head.querySelector('p');
      if (copy) copy.classList.add('phase34-mode-copy');
    }

    var capability = document.createElement('div');
    capability.className = 'phase34-capabilities';
    capability.innerHTML = '<span class="eyebrow">Capabilities</span>' +
      ['Strategy','Analytics','Brand','Campaign','Digital','Spatial','Technology']
        .map(function (x) { return '<a href="#work" data-mode="'+x.toLowerCase()+'">'+x+'</a>'; }).join('');

    var filterWrap = document.createElement('div');
    filterWrap.className = 'phase34-filters';
    var filterButtons = filters.querySelector('#filters');
    if (filterButtons) {
      Array.prototype.slice.call(filterButtons.children).forEach(function (node) {
        filterWrap.appendChild(node);
      });
    }

    if (tdb) {
      tdb.parentNode.insertBefore(capability, tdb.nextSibling);
      tdb.parentNode.insertBefore(filterWrap, capability.nextSibling);
    } else {
      section.querySelector('.wrap').appendChild(capability);
      section.querySelector('.wrap').appendChild(filterWrap);
    }
    filters.remove();
  }

  function collapseStandaloneCapabilities() {
    var cap = document.querySelector('.cap');
    if (cap) cap.setAttribute('hidden','hidden');
  }

  function standardizeProjects() {
    document.querySelectorAll('.project').forEach(function (project, index) {
      if (project.dataset.phase34) return;
      project.dataset.phase34 = '1';
      var detail = project.querySelector(':scope > div:not(.media):not(.num)');
      if (!detail) return;
      var h3 = detail.querySelector('h3');
      var meta = detail.querySelector('.meta');
      var status = detail.querySelector('.status');
      if (!h3) return;
      var metaRow = document.createElement('div');
      metaRow.className = 'phase34-project-meta';
      var type = document.createElement('span');
      type.className = 'phase34-type';
      type.textContent = meta ? meta.textContent : '';
      var state = document.createElement('span');
      state.className = 'phase34-status';
      state.textContent = status ? status.textContent : ('PROJECT '+String(index+1).padStart(2,'0'));
      metaRow.append(type,state);
      if (meta) meta.replaceWith(metaRow); else detail.appendChild(metaRow);
      if (status) status.remove();
      var eyebrow = document.createElement('div');
      eyebrow.className = 'phase34-case-label';
      eyebrow.textContent = 'WORK / '+String(index+1).padStart(2,'0');
      detail.insertBefore(eyebrow, h3);
    });
  }

  function upgradeCareerOS() {
    var career = document.getElementById('career');
    if (!career || career.dataset.phase34) return;
    career.dataset.phase34 = '1';
    var wrap = career.querySelector('.wrap');
    if (!wrap) return;
    var lead = wrap.querySelector('.lead');
    var row = wrap.querySelector('.row');
    var h2 = wrap.querySelector('h2');
    var engine = wrap.querySelector('.engine');
    var metrics = wrap.querySelector('.metrics');
    if (row) row.classList.add('phase34-case-label');
    if (h2 && lead) {
      var intro = document.createElement('div');
      intro.className = 'phase34-case-intro';
      var left = document.createElement('div');
      var right = document.createElement('div');
      left.appendChild(h2);
      right.appendChild(lead);
      intro.append(left,right);
      if (engine) wrap.insertBefore(intro, engine);
    }
    if (engine) engine.className = 'engine phase34-decision-grid';
    if (metrics) metrics.className = 'metrics phase34-metrics';
    var note = document.createElement('div');
    note.className = 'phase34-note';
    note.textContent = 'DECISION LOGIC / FRAME → TEST → MODEL → PRIORITIZE → DECIDE';
    wrap.appendChild(note);
  }

  function wireCapabilityLinks() {
    document.querySelectorAll('.phase34-capabilities a[data-mode]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var mode = link.getAttribute('data-mode');
        var target = document.querySelector('.filter[data-f="'+mode+'"]');
        if (target) { e.preventDefault(); target.click(); document.getElementById('work')?.scrollIntoView({behavior:'smooth'}); }
      });
    });
  }

  function run() {
    injectStyles();
    moveFilterIntoOperatingMode();
    collapseStandaloneCapabilities();
    standardizeProjects();
    upgradeCareerOS();
    wireCapabilityLinks();
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded',run,{once:true});
  else run();
})();
