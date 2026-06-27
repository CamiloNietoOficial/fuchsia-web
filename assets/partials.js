// Header y footer comunes, inyectados via JS para no duplicar markup en cada pagina.
(function(){
  const LOGO = `<img src="/assets/img/fuchsia-logo-oficial.png" alt="Fuchsia" style="height:38px;width:auto">`;

  const header = `
  <header class="site-header">
    <div class="container">
      <a href="/" class="brand">${LOGO}</a>
      <nav class="main-nav">
        <a href="/" class="glow-spot">Inicio</a>
        <a href="/quienes-somos/" class="glow-spot">Quiénes somos</a>
        <a href="/servicios/" class="glow-spot">Talleres</a>
        <a href="/empowerd/" class="glow-spot">E-Mujer</a>
        <a href="/blog/" class="glow-spot">Blog</a>
        <a href="/contacto/" class="glow-spot">Contáctenos</a>
        <a href="/login/" class="btn ghost">Iniciar sesión</a>
      </nav>
    </div>
  </header>`;

  const footer = `
  <footer>
    <div class="container">
      <div>
        ${LOGO}
        <p style="margin-top:10px">Finanzas y negocios · Crecimiento personal · Desarrollo profesional · Imagen y liderazgo</p>
      </div>
      <div>
        <p>© <span id="anio"></span> Fuchsia. Todos los derechos reservados.</p>
        <p><a href="/contacto/" class="glow-spot">Contáctenos</a> · <a href="/empowerd/" class="glow-spot">E-Mujer (gratis)</a></p>
      </div>
    </div>
  </footer>`;

  document.write(`<div id="fuchsia-header">${header}</div>`);
  window.addEventListener('DOMContentLoaded', ()=>{
    document.body.insertAdjacentHTML('beforeend', footer);
    const a = document.getElementById('anio'); if(a) a.textContent = new Date().getFullYear();
    if(window.FUCHSIA && window.FUCHSIA.initTilt){ window.FUCHSIA.initTilt(); window.FUCHSIA.initReveal(); window.FUCHSIA.initGlowSpots(); }
  });
})();
