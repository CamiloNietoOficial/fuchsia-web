// Interacciones globales: tilt 3D al mouse, glow de color, scroll-reveal
(function(){
  function attachTilt(card){
    const max = 10;
    card.addEventListener('mousemove', e=>{
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const ry = (px - .5) * max * 2;
      const rx = (.5 - py) * max * 2;
      card.style.setProperty('--rx', rx.toFixed(2)+'deg');
      card.style.setProperty('--ry', ry.toFixed(2)+'deg');
      card.style.setProperty('--mx', (px*100).toFixed(1)+'%');
      card.style.setProperty('--my', (py*100).toFixed(1)+'%');
    });
    card.addEventListener('mouseleave', ()=>{
      card.style.setProperty('--rx','0deg');
      card.style.setProperty('--ry','0deg');
    });
  }

  function initTilt(root=document){
    root.querySelectorAll('.tilt-card').forEach(attachTilt);
  }

  function initReveal(){
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(entries=>{
      entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('in'); obs.unobserve(en.target); } });
    }, {threshold:.15});
    els.forEach(el=>obs.observe(el));
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    initTilt();
    initReveal();
  });

  window.FUCHSIA = window.FUCHSIA || {};
  window.FUCHSIA.initTilt = initTilt;
  window.FUCHSIA.initReveal = initReveal;
})();
