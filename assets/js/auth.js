(function(){
  function traducirError(msg){
    const m = {
      'Invalid login credentials': 'Correo o contraseña incorrectos.',
      'User already registered': 'Ese correo ya está registrado.',
      'Email not confirmed': 'Confirma tu correo antes de iniciar sesión.',
    };
    return m[msg] || msg;
  }

  async function registrar(email, password, nombre, telefono){
    return window.FUCHSIA_SB.auth.signUp({
      email, password,
      options: { data: { nombre, telefono, acepta: true } }
    });
  }

  async function iniciarSesion(email, password){
    return window.FUCHSIA_SB.auth.signInWithPassword({ email, password });
  }

  async function iniciarConGoogle(){
    return window.FUCHSIA_SB.auth.signInWithOAuth({ provider: 'google' });
  }

  async function recuperarPassword(email){
    return window.FUCHSIA_SB.auth.resetPasswordForEmail(email, { redirectTo: location.origin + '/recuperar/' });
  }

  async function cerrarSesion(){
    await window.FUCHSIA_SB.auth.signOut();
    location.href = '/';
  }

  async function sesionActual(){
    const { data } = await window.FUCHSIA_SB.auth.getSession();
    return data.session;
  }

  window.FUCHSIA = window.FUCHSIA || {};
  Object.assign(window.FUCHSIA, { traducirError, registrar, iniciarSesion, iniciarConGoogle, recuperarPassword, cerrarSesion, sesionActual });
})();
