(function(){
  function init(){
    var wrap=document.querySelector('.radial-canvas-container');
    if(!wrap || wrap.dataset.bbLabEnhanced) return;
    wrap.dataset.bbLabEnhanced='true';
    var style=document.createElement('style');
    style.textContent='.bb-lab-guide{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:.78}.bb-lab-guide circle{fill:none;stroke:#B9885F;stroke-opacity:.18;stroke-width:1}.bb-lab-guide line{stroke:#D4C4B7;stroke-opacity:.13;stroke-width:1;stroke-dasharray:2 7}.bb-lab-guide .core{fill:#B9885F;fill-opacity:.42;stroke:none}.bb-lab-telemetry{position:absolute;right:12px;bottom:10px;font:500 8px/1.4 var(--fm);letter-spacing:.06em;text-transform:uppercase;color:var(--muted);pointer-events:none}.bb-lab-telemetry strong{color:var(--accent);font-weight:500}.bb-lab-artifact{margin-top:8px;font:500 9px var(--fm);letter-spacing:.07em;text-transform:uppercase;color:var(--muted)}.bb-lab-artifact strong{color:var(--accent);font-weight:500}.radial-experiment.bb-lab-equilibrium .radial-status{color:var(--stone)}';
    document.head.appendChild(style);
    var svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('class','bb-lab-guide');svg.setAttribute('viewBox','0 0 100 100');svg.setAttribute('aria-hidden','true');
    [17,31,45].forEach(function(r){var c=document.createElementNS('http://www.w3.org/2000/svg','circle');c.setAttribute('cx','50');c.setAttribute('cy','50');c.setAttribute('r',r);svg.appendChild(c)});
    [[50,8,50,92],[8,50,92,50]].forEach(function(v){var l=document.createElementNS('http://www.w3.org/2000/svg','line');l.setAttribute('x1',v[0]);l.setAttribute('y1',v[1]);l.setAttribute('x2',v[2]);l.setAttribute('y2',v[3]);svg.appendChild(l)});
    var core=document.createElementNS('http://www.w3.org/2000/svg','circle');core.setAttribute('class','core');core.setAttribute('cx','50');core.setAttribute('cy','50');core.setAttribute('r','1.1');svg.appendChild(core);wrap.insertBefore(svg,wrap.firstChild);
    var telemetry=document.createElement('div');telemetry.className='bb-lab-telemetry';telemetry.innerHTML='FIELD <strong>VECTOR</strong>';wrap.appendChild(telemetry);
    var card=wrap.closest('.radial-experiment')||wrap.closest('.card');if(!card)return;var controls=card.querySelector('.radial-controls');
    if(controls){var artifact=document.createElement('div');artifact.className='bb-lab-artifact';artifact.innerHTML='Artifact / <strong>R-001</strong>';controls.appendChild(artifact);var n=1,btn=card.querySelector('#radial-break');if(btn){btn.addEventListener('click',function(){n++;artifact.innerHTML='Artifact / <strong>R-'+String(n).padStart(3,'0')+'</strong>';setTimeout(function(){card.classList.add('bb-lab-equilibrium');telemetry.innerHTML='STATE <strong>NEW EQUILIBRIUM</strong>'},1600)},{passive:true})}}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
