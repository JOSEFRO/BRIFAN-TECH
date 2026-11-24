# BRIFAN TECH — Remediación de privacidad de perfiles

Estado: propuesta técnica; **no aplicada a Supabase**.

## Hallazgo confirmado (consulta de solo lectura)

La política `Profiles are public` de `public.profiles` es `FOR SELECT TO public USING (true)`. Por ello, cualquier visitante puede consultar todas las filas de `profiles`, incluidos `role`, `id` y demás columnas concedidas por los privilegios SQL.

La preferencia `user_preferences.profile_visibility` existe y admite `public`, `members` y `private`, pero las políticas actuales de `user_preferences` solo permiten a cada usuario leer/escribir su propia fila. Por tanto, la política actual de `profiles` no consulta ni aplica esa preferencia.

Columnas verificadas:
- `profiles`: id, username, display_name, bio, avatar_url, website, role, created_at, updated_at.
- `user_preferences`: user_id, language, theme, accent_color, reading_density, email_replies, email_publications, in_app_updates, profile_visibility, updated_at.

## Objetivos de seguridad

1. El propietario siempre puede consultar y actualizar su propio perfil.
2. `public`: el perfil público mínimo puede verse sin iniciar sesión.
3. `members`: solo usuarios autenticados pueden verlo.
4. `private`: solo el propietario y los administradores autorizados pueden verlo.
5. El rol administrativo nunca debe incluirse en una respuesta pública de perfil.
6. Los comentarios deben seguir mostrando el nombre/username del autor sin abrir la tabla completa de perfiles.

## Diseño recomendado

- Retirar la política permisiva `Profiles are public`; las políticas RLS permisivas se combinan con OR, así que añadir otra política restrictiva sin retirar esta no cerraría el acceso.
- Crear una función auxiliar pequeña, en un esquema no expuesto por la API (por ejemplo `private`), con `SECURITY DEFINER`, `STABLE`, `search_path` fijo y permisos de ejecución mínimos. Debe resolver visibilidad leyendo `user_preferences` sin depender de las políticas de lectura propias de esa tabla. Debe comparar el usuario autenticado con el propietario y contemplar explícitamente el caso anónimo.
- La política SELECT de `profiles` debe permitir propietario, perfiles públicos, perfiles de miembros a usuarios autenticados y acceso administrativo comprobado por una fuente de roles confiable. No debe confiar en un rol enviado por el cliente.
- Exponer únicamente columnas permitidas para los datos de autor. La implementación actual conserva la relación PostgREST directa `comments -> profiles` y limita las columnas mediante grants; debe verificarse el join anidado en las pruebas. Una vista `security_invoker = true` sería una alternativa si el join directo no funciona con los grants por columna.
- Mantener la consulta del panel de configuración limitada al perfil propio.
- El acceso administrativo debe validarse en servidor/RLS; la visibilidad de la interfaz no es un control de seguridad.

## Dependencias de código detectadas

- `SettingsPanel.tsx` lee el perfil propio con columnas explícitas y guarda preferencias en `user_preferences`.
- `App.tsx` consulta `profiles(display_name,username)` para mostrar autores de comentarios.
- `App.tsx` consulta `profiles.role` para identificar la cuenta administradora. Antes de restringir columnas o crear una vista de perfil público, esta comprobación debe conservarse mediante un mecanismo seguro para el usuario actual; no debe resolverse exponiendo `role` de todos los usuarios.

## Pruebas obligatorias antes de producción

| Actor | Perfil public | Perfil members | Perfil private | role de terceros |
|---|---:|---:|---:|---:|
| Anónimo | Sí, campos públicos | No | No | Nunca |
| Miembro autenticado | Sí | Sí | No | Nunca |
| Propietario autenticado | Sí | Sí | Sí | Solo su propio rol por mecanismo autorizado |
| Administrador autenticado | Sí | Sí | Sí | Solo mediante operación administrativa autorizada |

También comprobar:
- `anon` no puede leer filas de `profiles` privadas ni enumerar IDs/roles.
- Un usuario no puede cambiar su propio `role` mediante UPDATE.
- El join de comentarios conserva nombre y username de autores visibles.
- El registro, inicio de sesión, edición de perfil y panel admin siguen funcionando.
- La relación anidada de comentarios devuelve únicamente `display_name` y `username` de perfiles que el lector puede ver.
- Las políticas de UPDATE existentes siguen limitadas a `id = auth.uid()`.

## Bloqueo actual

No se ejecutó SQL de escritura, no se creó una rama de Supabase y no se modificaron datos ni políticas de producción. La corrección debe probarse en un proyecto/branch aislado con cuentas de prueba. El coste de crear ese entorno debe verificarse antes de provisionarlo.

**No aplicar esta propuesta como SQL directo sin revisar primero las funciones/roles administrativos existentes y los permisos SQL actuales.**


## Implementación preparada en la rama

Se añadió `supabase/migrations/20261124090000_profile_visibility_rls.sql` como **borrador versionado**, no aplicado a ninguna base de datos.

El borrador:
- Implementa una función auxiliar `private.can_view_profile(uuid)` con `SECURITY DEFINER`, `search_path` vacío y acceso controlado para evaluar la visibilidad.
- Sustituye la política SELECT pública sin restricciones por una política que respeta `public`, `members` y `private`.
- Reduce los privilegios de tabla de `profiles` a SELECT de campos de perfil no sensibles y UPDATE de los campos editables. También revoca el permiso UPDATE por columna preexistente sobre `username`, que la interfaz presenta como solo lectura.
- Ajusta `public.is_admin()` para que las políticas RLS existentes puedan seguir comprobando roles sin conceder SELECT de la columna `role`. Se conserva EXECUTE para `anon` porque hay políticas actuales de tablas públicas que llaman a esa función; para una sesión anónima debe devolver false.
- Ajusta `guard_profile_role_changes()` para conservar su comprobación de administrador al retirar permisos directos sobre `role`.

La consulta de auditoría confirmó que `is_admin()` es utilizada por políticas RLS de `articles`, `article_tags`, `categories`, `comments` y `tags`. Por eso no debe revocarse su ejecución a `anon` de forma aislada.

## Validación pendiente

El archivo SQL fue guardado y releído desde GitHub, pero no se ha ejecutado ni validado contra una instancia PostgreSQL aislada. El CI de la aplicación no ejecuta migraciones SQL ni pruebas RLS. El último commit de la migración todavía no tiene un resultado de workflow confirmado.

Antes de producción se debe crear un entorno aislado con autorización de coste, aplicar allí esta migración, ejecutar pruebas con sesiones anon/authenticated/admin y verificar las consultas anidadas de comentarios. No fusionar ni aplicar esta migración basándose únicamente en el build de frontend.
