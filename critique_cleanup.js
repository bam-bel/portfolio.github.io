(function(){
  function init(){
    if(document.documentElement.dataset.critiqueCleanup) return;
    document.documentElement.dataset.critiqueCleanup='true';

    var style=document.createElement('style');
    style.textContent=`
      .filters{position:static!important;background:transparent!important;backdrop-filter:none!important;border-radius:0!important}
      .filters .wrap{padding:0!important;gap:22px!important}
      .filter{padding:0!important;border-radius:0!important;background:transparent!important;font-size:9px!important;letter-spacing:.09em!important}
      .filter.active,.filter:hover{color:var(--ink)!important;background:transparent!important}
      .tdb,.project,.engine,.metric,.seq,.media-card,.radial-telemetry{border-color:transparent!important;border-width:0!important}
      .tdb article+article,.step+ .step{border-left:0!important}
      .step{border-right:0!important}
      .project{padding:54px 0!important}
      .project .meta{opacity:.7}
      .mood{grid-template-columns:repeat(2,1fr)!important;max-width:980px}
      .mood img{border-radius:0!important}
      .card{border-radius:0!important}
      .grid div{border:0!important}
      .play-grid{gap:38px!important}
      .play-grid>.card{background:transparent!important;padding:0!important}
      .clean-filters{margin:0 0 58px}
      .career-visual{min-height:220px;display:grid;place-items:center;background:radial-gradient(circle at 50% 50%,rgba(185,136,95,.12),transparent 62%);position:relative;overflow:hidden}
      .career-visual:before,.career-visual:after{content:'';position:absolute;border:0 solid rgba(185,136,95,.18);border-radius:50%;pointer-events:none}
      .career-visual:before{width:180px;height:180px;border-width:1px}.career-visual:after{width:280px;height:280px;border-width:1px}
      .career-flow{position:relative;z-index:1;display:flex;align-items:center;gap:10px;flex-wrap:wrap;justify-content:center;font:9px var(--fm);text-transform:uppercase;letter-spacing:.06em;color:var(--stone)}
      .career-flow b{font-weight:500;color:var(--accent)}
      .atmo-wrap{display:grid;gap:10px}
      .atmo-slider{width:100%;accent-color:var(--accent)}
      .atmo-readout{font:9px var(--fm);letter-spacing:.05em;text-transform:uppercase;color:var(--muted)}
      @media(max-width:900px){.filters .wrap{gap:14px!important;overflow:auto;white-space:nowrap}.project{padding:42px 0!important}.play-grid{gap:42px!important}.mood{grid-template-columns:1fr!important}}
      @media(prefers-reduced-motion:reduce){.career-visual,.swatch{transition:none!important}}
    `;
    document.head.appendChild(style);

    var firstSection=document.querySelector('section.section');
    var filters=document.querySelector('.filters');
    if(firstSection && filters){
      var head=firstSection.querySelector('.head');
      if(head){
        var holder=document.createElement('div');
        holder.className='clean-filters';
        holder.appendChild(filters);
        head.insertAdjacentElement('afterend',holder);
      }
    }

    document.querySelectorAll('.project').forEach(function(card){
      var title=card.querySelector('h3');
      var media=card.querySelector('.media');
      if(title && media && title.textContent.trim()==='Career OS'){
        media.innerHTML='<div class="career-visual" aria-label="Career OS decision system visual"><div class="career-flow"><b>OBSERVE</b><span>→</span><b>MODEL</b><span>→</span><b>PRIORITIZE</b><span>→</span><b>DECIDE</b></div></div>';
      }
    });

    var mood=document.querySelector('#mestawet .mood');
    if(mood){
      var imgs=mood.querySelectorAll('img');
      for(var i=imgs.length-1;i>=2;i--) imgs[i].remove();
      imgs=mood.querySelectorAll('img');
      if(imgs[0]) imgs[0].alt='Mestawet glass application';
      if(imgs[1]) imgs[1].alt='Mestawet facade application';
    }

    document.querySelectorAll('body *').forEach(function(el){
      var cs=getComputedStyle(el);
      if(cs.position==='fixed' && /Beamlak Belay/.test(el.textContent||'') && /Systems|Analysis|Design|Experience/.test(el.textContent||'')) el.remove();
    });

    var swatch=document.querySelector('.swatch');
    if(swatch){
      swatch.classList.add('atmo-wrap');
      swatch.style.height='170px';
      swatch.style.transition='background .25s ease';
      var balance=document.createElement('input');
      balance.className='atmo-slider'; balance.type='range'; balance.min='0'; balance.max='100'; balance.value='50'; balance.setAttribute('aria-label','Color atmosphere balance');
      var readout=swatch.parentElement.querySelector('.readout');
      var read=document.createElement('div'); read.className='atmo-readout';
      var lastX=.5,lastY=.5;
      function paint(){
        var v=+balance.value/100;
        swatch.style.background='radial-gradient(circle at '+Math.round(lastX*100)+'% '+Math.round(lastY*100)+'%, rgba(185,136,95,.95), transparent 42%), linear-gradient(135deg, #B9885F '+Math.round(v*100)+'%, #D4C4B7 100%)';
        read.textContent='Accent / Stone · '+Math.round(v*100)+'%';
        if(readout) readout.textContent='Accent / Stone balance · '+Math.round(v*100)+'%';
      }
      swatch.innerHTML=''; swatch.appendChild(balance); swatch.appendChild(read); balance.style.alignSelf='end'; swatch.style.padding='0 0 12px';
      swatch.addEventListener('pointermove',function(e){var r=swatch.getBoundingClientRect();lastX=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width));lastY=Math.max(0,Math.min(1,(e.clientY-r.top)/r.height));paint()},{passive:true});
      balance.addEventListener('input',paint);
      paint();
    }

    document.querySelectorAll('.kpi[data-target]').forEach(function(k){
      k.setAttribute('role','button');k.setAttribute('tabindex','0');
      var activate=function(){document.getElementById(k.dataset.target).classList.toggle('open');k.classList.toggle('active')};
      k.addEventListener('click',activate);k.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();activate()}});
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
