(function(){
  async function requireAdmin(){
    const session = await window.FUCHSIA.sesionActual();
    if (!session) { location.href = '/login/?next=/admin/'; return null; }
    const { data: perfil } = await window.FUCHSIA_SB.from('profiles').select('is_admin').eq('id', session.user.id).single();
    if (!perfil || !perfil.is_admin) { document.body.innerHTML = '<p style="padding:60px;text-align:center">No tienes acceso a este panel.</p>'; return null; }
    return session;
  }

  async function subirImagen(file){
    const nombre = `${Date.now()}-${file.name}`;
    const { error } = await window.FUCHSIA_SB.storage.from('fuchsia-img').upload(nombre, file);
    if (error) throw error;
    const { data } = window.FUCHSIA_SB.storage.from('fuchsia-img').getPublicUrl(nombre);
    return data.publicUrl;
  }

  window.FUCHSIA = window.FUCHSIA || {};
  Object.assign(window.FUCHSIA, { requireAdmin, subirImagen });
})();
