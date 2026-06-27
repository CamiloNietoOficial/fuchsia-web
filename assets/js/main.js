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

  function attachGlowSpot(el){
    el.addEventListener('mousemove', e=>{
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', ((e.clientX-r.left)/r.width*100).toFixed(1)+'%');
      el.style.setProperty('--my', ((e.clientY-r.top)/r.height*100).toFixed(1)+'%');
    });
  }

  function initGlowSpots(root=document){
    root.querySelectorAll('.glow-spot').forEach(attachGlowSpot);
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
    initGlowSpots();
  });

  // Tarjeta de video: si ya hay mp4 auto-hosteado lo reproduce, si no muestra
  // un poster elegante con boton "play" que enlaza al video original (sin
  // mostrar el embed roto/con marca de la plataforma).
  function videoCard({ poster, mp4, link, alt }){
    poster = poster || '/assets/img/fuchsia-fuchsia-logo.jpeg';
    if (mp4) {
      return `<div class="video-embed reveal"><video controls preload="none" poster="${poster}"><source src="/assets/video/${mp4}"></video></div>`;
    }
    return `
    <a href="${link}" target="_blank" rel="noopener" class="video-embed reveal" style="position:relative">
      <img src="${poster}" alt="${alt||''}" style="width:100%;height:100%;object-fit:cover">
      <span style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(20,5,20,.3)">
        <span style="width:60px;height:60px;border-radius:50%;background:rgba(255,255,255,.92);display:flex;align-items:center;justify-content:center;font-size:1.3rem;color:var(--fucsia)">▶</span>
      </span>
    </a>`;
  }

  window.FUCHSIA = window.FUCHSIA || {};
  window.FUCHSIA.initTilt = initTilt;
  window.FUCHSIA.initReveal = initReveal;
  window.FUCHSIA.initGlowSpots = initGlowSpots;
  window.FUCHSIA.videoCard = videoCard;
})();
