// Header y footer comunes, inyectados via JS para no duplicar markup en cada pagina.
(function(){
  const header = `
  <header class="site-header">
    <div class="container">
      <a href="/" class="brand"><img src="/assets/img/fuchsia-fuchsia-logo.jpeg" alt="Fuchsia"></a>
      <nav class="main-nav">
        <a href="/quienes-somos/">Quiénes somos</a>
        <a href="/servicios/">Talleres</a>
        <a href="/empowerd/">Empowerd Mujer <span class="gratis">Gratis</span></a>
        <a href="/blog/">Blog</a>
        <a href="/contacto/">Contáctenos</a>
        <a href="/login/" class="btn ghost">Iniciar sesión</a>
      </nav>
    </div>
  </header>`;

  const footer = `
  <footer>
    <div class="container">
      <div>
        <img src="/assets/img/fuchsia-fuchsia-logo.jpeg" alt="Fuchsia" style="height:34px;margin-bottom:10px">
        <p>Finanzas y negocios · Crecimiento personal · Desarrollo profesional · Imagen y liderazgo</p>
      </div>
      <div>
        <p>© <span id="anio"></span> Fuchsia. Todos los derechos reservados.</p>
        <p><a href="/contacto/">Contáctenos</a> · <a href="/empowerd/">Empowerd Mujer</a></p>
      </div>
    </div>
  </footer>`;

  document.write(`<div id="fuchsia-header">${header}</div>`);
  window.addEventListener('DOMContentLoaded', ()=>{
    document.body.insertAdjacentHTML('beforeend', footer);
    const a = document.getElementById('anio'); if(a) a.textContent = new Date().getFullYear();
    if(window.FUCHSIA && window.FUCHSIA.initTilt){ window.FUCHSIA.initTilt(); window.FUCHSIA.initReveal(); }
  });
})();
