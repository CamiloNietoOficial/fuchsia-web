# Fuchsia — Sitio web oficial

Sitio estático (HTML/CSS/JS, sin build) para **fuchsia.com.co**, hosteado en
GitHub Pages con dominio propio vía Cloudflare. Datos dinámicos (talleres,
masterclasses, registros, contacto, auth) en Supabase (proyecto `fuchsia`,
ref `unwbfjkjcuslbnesbgjd`).

## Estructura

- `index.html`, `quienes-somos/`, `servicios/` (talleres), `talleres/`
  (detalle + inscripción por `?slug=`), `empowerd/` (Empowerd Mujer, gratis),
  `blog/`, `contacto/`, `login/`, `admin/` (dashboard, requiere `is_admin`).
- `assets/css/styles.css` — identidad visual (paleta fucsia/negro/blanco,
  tarjetas con tilt 3D al mouse, microinteracciones de color).
- `assets/js/` — `config.js` (llaves públicas Supabase), `supabase-init.js`,
  `talleres.js`, `masterclasses.js`, `auth.js`, `admin.js`, `main.js` (tilt +
  scroll-reveal).
- `supabase_schema.sql` — esquema completo (tablas, RLS, trigger de perfil,
  bucket de storage). Ya aplicado en el proyecto Supabase.

## Flujo de inscripción a talleres

Replica la lógica que ya existía en PHP (`eventos/evento.php` del backup de
Hostinger), ahora en Supabase + JS: el formulario en `/talleres/?slug=...`
inserta en `registros_talleres` y redirige al link de pago Wompi/Nequi
(preventa o regular) según la fecha límite de preventa del taller.

## Admin

Para convertir un usuario en administrador:
```sql
update public.profiles set is_admin = true where correo = 'correo@ejemplo.com';
```
Desde `/admin/` se crean/borran talleres y masterclasses, incluyendo el
diseño de los campos del formulario de inscripción y los links de pago.

## Actualizar el sitio

Editar los archivos y `git push`. No hay paso de build.
