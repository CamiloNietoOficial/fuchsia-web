(function(){
  async function cargarMasterclasses(){
    const { data, error } = await window.FUCHSIA_SB
      .from('masterclasses')
      .select('*')
      .order('fecha', { ascending: false });
    if (error) { console.error(error); return []; }
    return data;
  }

  function cardMasterclass(m){
    const pasada = m.estado !== 'proxima';
    const img = m.imagen_url || '/assets/img/empowerd-logo-empowerd.jpeg';
    const btnRegistro = (!pasada && m.link_registro)
      ? `<a href="${m.link_registro}" class="btn" style="margin-top:12px;display:block;text-align:center">Separar mi cupo</a>`
      : '';
    return `
    <div class="tilt-card reveal ${pasada?'pasado':''}">
      <div class="glow"></div>
      <span class="estado-pill">${pasada ? 'Ya pasó' : 'Próxima'}</span>
      <img class="card-img" src="${img}" alt="${m.titulo}">
      <div class="card-body"><h3>${m.titulo}</h3>${btnRegistro}</div>
    </div>`;
  }

  window.FUCHSIA = window.FUCHSIA || {};
  window.FUCHSIA.cargarMasterclasses = cargarMasterclasses;
  window.FUCHSIA.cardMasterclass = cardMasterclass;
})();
