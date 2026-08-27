/* Preserves the original Phase 3–4 structure runtime, then applies the Phase 2/playground repair. */
(function(){'use strict';function load(src,done){var s=document.createElement('script');s.src=src;s.onload=done;document.head.appendChild(s)}load('phase34_structure_base.js',function(){load('phase2-4-repair.js',function(){/* repair runtime loaded */});});})();
