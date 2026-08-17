/* BB Radial System v2 — Canvas runtime */
(function(){
  function init(){
    var stage=document.querySelector('.radial-stage');
    if(!stage || stage.dataset.radialCanvasV2) return;
    stage.dataset.radialCanvasV2='true';

    var oldSvg=document.getElementById('radialSvg');
    if(oldSvg) oldSvg.remove();

    var canvas=document.createElement('canvas');
    canvas.id='radial-canvas-v2';
    canvas.setAttribute('role','img');
    canvas.setAttribute('aria-label','Interactive concentric radial geometry experiment');
    canvas.style.cssText='width:100%;height:100%;display:block;cursor:none;background:#0A0F15;';
    stage.appendChild(canvas);
    var ctx=canvas.getContext('2d',{alpha:true});
    if(!ctx) return;

    /* Localized DOM cursor — scoped to the Playground only. */
    var cursor=document.createElement('div');
    cursor.className='canvas-cursor';
    cursor.setAttribute('aria-hidden','true');
    stage.appendChild(cursor);
    var cursorStyle=document.createElement('style');
    cursorStyle.textContent=''+
      '.radial-stage{position:relative}'+
      '.radial-stage,.radial-stage canvas,.radial-stage *{cursor:none!important}'+
      '.canvas-cursor{position:absolute;left:0;top:0;width:8px;height:8px;margin:-4px 0 0 -4px;border-radius:50%;background:#FAF9F6;pointer-events:none;mix-blend-mode:difference;z-index:20;opacity:0;transform:translate3d(-100px,-100px,0);transition:width .3s cubic-bezier(.16,1,.3,1),height .3s cubic-bezier(.16,1,.3,1),margin .3s cubic-bezier(.16,1,.3,1),background-color .3s ease,border-color .3s ease,box-shadow .3s ease,opacity .2s ease}'+
      '.canvas-cursor.is-interacting{width:32px;height:32px;margin:-16px 0 0 -16px;background:transparent;border:1px solid #FAF9F6}'+
      '.canvas-cursor.is-broken{width:14px;height:14px;margin:-7px 0 0 -7px;background:#B9885F;border:0;mix-blend-mode:normal;box-shadow:0 0 12px rgba(185,136,95,.4)}'+
      '@media (pointer:coarse), (prefers-reduced-motion:reduce){.canvas-cursor{display:none!important}}';
    document.head.appendChild(cursorStyle);

    var freq=document.getElementById('radialFreq');
    var amp=document.getElementById('radialAmp');
    var freqValue=document.getElementById('freqValue');
    var ampValue=document.getElementById('ampValue');
    var lock=document.getElementById('pointLock');
    var brk=document.getElementById('breakRadial');
    var status=document.getElementById('radialStatus');
    var state=document.getElementById('radialState');
    var telemetry=document.getElementById('radialTelemetry');
    var artifact=document.getElementById('radialArtifactId');
    var reduced=window.matchMedia('(prefers-reduced-motion: reduce)');

    var dpr=1,w=1,h=1,phase=0,last=performance.now(),raf=0,running=false;
    var locked=true,broken=false,breakStarted=0,equilibrium=false;
    var mouse={x:-1e5,y:-1e5,active:false};
    var sys={freq:+freq.value,amp:+amp.value,phaseSpeed:reduced.matches?0.001:0.015,wobble:0};
    var target={freq:sys.freq,amp:sys.amp,phaseSpeed:sys.phaseSpeed,wobble:0};
    var rings=4;
    var ringScale=[0.55,0.75,0.94,1.12];

    function resize(){
      var rect=stage.getBoundingClientRect();
      dpr=Math.min(window.devicePixelRatio||1,2);
      w=Math.max(1,rect.width); h=Math.max(1,rect.height);
      canvas.width=Math.round(w*dpr); canvas.height=Math.round(h*dpr);
      canvas.style.width=w+'px'; canvas.style.height=h+'px';
      ctx.setTransform(dpr,0,0,dpr,0,0);
    }

    function lerp(a,b,t){return a+(b-a)*t}
    function smoothStep(x){return x*x*(3-2*x)}
    function noise(i,r,p){return Math.sin(i*12.9898+r*78.233+p*1.731)*0.5}
    function pointAngle(i,f,p,r){
      var base=i*(Math.PI*2/f);
      if(locked) return base;
      return base+Math.sin(p*0.31+i*0.77+r)*0.018;
    }
    function hoverForce(px,py){
      if(reduced.matches || !mouse.active) return 0;
      var dx=px-mouse.x,dy=py-mouse.y,d=Math.hypot(dx,dy),radius=100;
      if(d>=radius) return 0;
      var influence=smoothStep(1-d/radius);
      return influence*18*(broken?-0.55:1);
    }

    function setCursorState(active){
      if(reduced.matches || !mouse.active){cursor.classList.remove('is-interacting');return;}
      if(broken){cursor.classList.remove('is-interacting');cursor.classList.add('is-broken');return;}
      cursor.classList.toggle('is-interacting',active);
      cursor.classList.remove('is-broken');
    }

    function setTelemetry(label){
      telemetry.textContent='R:72 / 48 / 84 · F:'+Math.round(sys.freq)+' · A:'+Math.round(sys.amp)+' · P:'+(locked?'LOCKED':'FREE');
      if(label) state.textContent=label;
    }

    function draw(now){
      if(!running) return;
      var dt=Math.min(32,now-last); last=now;
      var rate=dt/16.67;
      sys.freq=lerp(sys.freq,target.freq,1-Math.pow(0.95,rate));
      sys.amp=lerp(sys.amp,target.amp,1-Math.pow(0.985,rate));
      sys.phaseSpeed=lerp(sys.phaseSpeed,target.phaseSpeed,1-Math.pow(0.978,rate));
      sys.wobble=lerp(sys.wobble,target.wobble,1-Math.pow(0.992,rate));
      phase+=sys.phaseSpeed*rate;

      ctx.fillStyle=reduced.matches?'#0A0F15':'rgba(10,15,21,0.18)';
      ctx.fillRect(0,0,w,h);

      var cx=w/2,cy=h/2,base=Math.min(w,h)*0.105;
      ctx.save();
      ctx.translate(cx,cy);

      /* calibrated geometry / containment */
      ctx.strokeStyle='rgba(42,52,64,.8)';
      ctx.lineWidth=1;
      for(var g=1;g<=rings;g++){
        ctx.beginPath();ctx.arc(0,0,base*g,0,Math.PI*2);ctx.stroke();
      }
      ctx.setLineDash([2,7]);
      ctx.strokeStyle='rgba(42,52,64,.35)';
      ctx.beginPath();ctx.moveTo(-base*4.2,0);ctx.lineTo(base*4.2,0);ctx.moveTo(0,-base*4.2);ctx.lineTo(0,base*4.2);ctx.stroke();
      ctx.setLineDash([]);

      var f=Math.max(6,Math.min(64,sys.freq));
      var activeMagneticField=false;
      for(var r=1;r<=rings;r++){
        var radius=base*r*ringScale[r-1];
        var prev=null;
        for(var i=0;i<f;i++){
          var angle=pointAngle(i,f,phase,r);
          var wave=Math.sin(phase+i*0.5+r)*sys.amp;
          var chaotic=broken?noise(i,r,phase)*sys.wobble*r*10:0;
          var rr=radius+wave+chaotic;
          var x=Math.cos(angle)*rr,y=Math.sin(angle)*rr;
          var force=hoverForce(cx+x,cy+y);
          if(force!==0) activeMagneticField=true;
          rr+=force;
          x=Math.cos(angle)*rr;y=Math.sin(angle)*rr;

          if(prev && !broken){
            ctx.beginPath();ctx.moveTo(prev.x,prev.y);ctx.lineTo(x,y);
            ctx.strokeStyle='rgba(185,136,95,'+(0.5-r*0.07)+')';ctx.lineWidth=.55;ctx.stroke();
          }

          ctx.beginPath();ctx.arc(x,y,broken?1.6:1.5,0,Math.PI*2);
          ctx.fillStyle=(broken&&i%5===0)?'rgba(212,196,183,.95)':'rgba(243,240,234,.88)';ctx.fill();
          prev={x:x,y:y};
        }
      }

      ctx.beginPath();ctx.arc(0,0,2.2,0,Math.PI*2);ctx.fillStyle='rgba(185,136,95,.65)';ctx.fill();
      ctx.restore();
      setCursorState(activeMagneticField);

      if(broken && !equilibrium && now-breakStarted>1600){equilibrium=true;setTelemetry('NEW EQUILIBRIUM');status.textContent='● SYSTEM REORGANIZED'}
      else if(!broken){setTelemetry('NORMAL')}
      else if(!equilibrium){setTelemetry('ANOMALY DETECTED')}

      raf=requestAnimationFrame(draw);
    }

    function start(){if(running)return;running=true;last=performance.now();raf=requestAnimationFrame(draw)}
    function stop(){running=false;cancelAnimationFrame(raf)}

    freq.addEventListener('input',function(){if(!broken){target.freq=+this.value;freqValue.textContent=this.value;setTelemetry()}});
    amp.addEventListener('input',function(){if(!broken){target.amp=+this.value;ampValue.textContent=this.value;setTelemetry()}});

    lock.addEventListener('click',function(){
      if(broken) return;
      locked=!locked;
      lock.classList.toggle('active',locked);
      lock.innerHTML='Point Lock <span>'+(locked?'ON':'OFF')+'</span>';
      setTelemetry();
    });

    brk.addEventListener('click',function(){
      if(broken)return;
      broken=true;breakStarted=performance.now();
      brk.textContent='RULE BROKEN';brk.disabled=true;
      status.textContent='● ANOMALY DETECTED';
      target.amp=Math.max(8,+amp.value*2.5);
      target.phaseSpeed=reduced.matches?0.003:0.032;
      target.wobble=2.5;
      sys.amp=Math.max(sys.amp*2,120);
      sys.phaseSpeed=reduced.matches?0.004:0.16;
      cursor.classList.remove('is-interacting');
      cursor.classList.add('is-broken');
      if(artifact){var n=parseInt((artifact.textContent||'R-001').replace(/\D/g,''),10)||1;artifact.textContent='R-'+String(n+1).padStart(3,'0')}
    });

    canvas.addEventListener('pointermove',function(e){
      if(reduced.matches || e.pointerType==='touch') return;
      var rect=canvas.getBoundingClientRect();
      mouse.x=e.clientX-rect.left;mouse.y=e.clientY-rect.top;mouse.active=true;
      cursor.style.opacity='1';
      cursor.style.transform='translate3d('+mouse.x+'px,'+mouse.y+'px,0)';
    },{passive:true});
    canvas.addEventListener('pointerenter',function(e){
      if(reduced.matches || e.pointerType==='touch') return;
      cursor.style.opacity='1';
    },{passive:true});
    canvas.addEventListener('pointerleave',function(){
      mouse.active=false;mouse.x=-1e5;mouse.y=-1e5;
      cursor.style.opacity='0';
      setCursorState(false);
    },{passive:true});

    if(window.ResizeObserver){new ResizeObserver(resize).observe(stage)}else{window.addEventListener('resize',resize,{passive:true})}
    reduced.addEventListener?.('change',function(){
      sys.phaseSpeed=reduced.matches?0.001:0.015;
      target.phaseSpeed=reduced.matches?0.001:0.015;
      cursor.style.opacity='0';
      mouse.active=false;
      mouse.x=-1e5;mouse.y=-1e5;
      setCursorState(false);
    });

    resize();setTelemetry('NORMAL');start();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();