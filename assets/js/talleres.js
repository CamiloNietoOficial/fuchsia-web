// Carga y render de talleres (servicios/, talleres detalle) usando Supabase
(function(){
  async function cargarTalleres(){
    const { data, error } = await window.FUCHSIA_SB
      .from('talleres')
      .select('*')
      .neq('estado', 'desactivado')
      .order('fecha_taller', { ascending: false });
    if (error) { console.error(error); return []; }
    return data;
  }

  function cardTaller(t){
    const pasado = t.estado !== 'proximo';
    const img = t.imagen_url || '/assets/img/fuchsia-fuchsia-logo.jpeg';
    return `
    <a href="/talleres/?slug=${encodeURIComponent(t.slug)}" class="tilt-card reveal ${pasado?'pasado':''}">
      <div class="glow"></div>
      <span class="estado-pill">${pasado ? 'Finalizado' : 'Próximo'}</span>
      <img class="card-img" src="${img}" alt="${t.titulo}">
      <div class="card-body">
        <div class="tag">${t.foco || ''}</div>
        <h3>${t.titulo}</h3>
      </div>
    </a>`;
  }

  window.FUCHSIA = window.FUCHSIA || {};
  window.FUCHSIA.cargarTalleres = cargarTalleres;
  window.FUCHSIA.cardTaller = cardTaller;
})();
