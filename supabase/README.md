# Supabase — BRIFAN TECH

## Estado del proyecto remoto

El proyecto remoto fue consultado en modo de solo lectura durante la revisión funcional.

- Estado: ACTIVE_HEALTHY
- Región: us-east-1
- Motor: PostgreSQL 17
- Tablas públicas: `profiles`, `categories`, `articles`, `tags`, `article_tags`, `comments`, `bookmarks`, `user_preferences`.
- RLS: habilitado en las ocho tablas.
- Buckets: `brifan-avatars` (público) y `brifan-articles` (privado).

## Historial remoto de migraciones

El historial remoto contiene ocho migraciones:

- `20261103161923_initial_content_platform_schema`
- `20261103191248_tighten_function_permissions_and_add_fk_indexes`
- `20261103194850_grant_ceo_role_and_expand_article_uploads`
- `20261103195022_allow_public_read_of_published_article_attachments`
- `20261103200957_protect_profile_roles_from_self_escalation`
- `20261105013258_tighten_profile_trigger_and_article_storage`
- `20261106161355_add_author_article_management`
- `20261106191414_create_user_preferences`

**Importante:** los archivos SQL originales no están versionados en este repositorio. El historial de versiones confirma que fueron aplicadas en el proyecto remoto, pero no permite reconstruir con seguridad el SQL exacto. No se deben inventar migraciones retroactivas ni ejecutar una migración inicial nueva contra producción.

Antes de adoptar Supabase CLI como flujo de migraciones:

1. Recupera/exporta los SQL originales desde el historial de desarrollo o una copia de seguridad.
2. Colócalos en `supabase/migrations/` conservando exactamente sus versiones y nombres.
3. Compara el esquema local con el remoto.
4. Valida las políticas RLS y Storage antes de aplicar cualquier cambio.

## Funcionalidad de aplicación conectada

La aplicación contiene flujos para:

- Registro, inicio y cierre de sesión con Supabase Auth.
- Lectura de publicaciones con estado `published`.
- Envío de artículos a revisión y moderación por administradores.
- Edición y eliminación de publicaciones propias, sujetas a RLS.
- Carga de archivos en el bucket privado `brifan-articles`.
- Lectura de adjuntos publicados y enlaces firmados para adjuntos privados.
- Comentarios asociados a publicaciones.
- Favoritos por usuario en `bookmarks`.
- Perfil y preferencias por usuario en `profiles` y `user_preferences`.

La revisión del esquema confirmó que las columnas usadas por esos flujos existen. Esto no sustituye una prueba de integración autenticada contra cada operación.

## Límites funcionales conocidos

- El selector de idioma guarda una preferencia, pero no traduce automáticamente todos los textos de la interfaz.
- Las preferencias de correo y notificaciones se almacenan, pero no hay un servicio de envío o notificaciones push conectado.
- La opción de visibilidad del perfil se almacena, pero sus niveles no se aplican todavía como reglas de acceso; la tabla `profiles` tiene lectura pública.
- No hay pruebas automatizadas de extremo a extremo para Auth, Storage, comentarios o moderación.
- Los perfiles y publicaciones requieren políticas RLS correctas; ocultar botones en React no es una barrera de autorización.

## Seguridad observada

- RLS está habilitado en las ocho tablas públicas.
- Las políticas limitan artículos propios, comentarios y favoritos por usuario.
- Un trigger `guard_profile_role_changes` impide que un usuario no administrador cambie su propio rol.
- Las políticas de Storage restringen las cargas y eliminaciones de archivos de artículos al autor correspondiente y permiten lectura pública de adjuntos asociados a artículos publicados.
- El asesor de seguridad de Supabase reporta que la protección contra contraseñas filtradas está deshabilitada. Se recomienda habilitarla en la configuración de Auth.

El asesor de rendimiento también reporta políticas permisivas superpuestas en algunas tablas y tres índices que aún no registran uso. Son avisos de optimización, no pruebas de fallo funcional; deben revisarse antes de modificar índices o políticas.

## Variables de entorno

En desarrollo local, copia `.env.example` a `.env.local` y configura:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

La clave publishable puede utilizarse en el navegador junto con políticas RLS correctas. Nunca agregues `service_role`, `sb_secret`, contraseñas ni tokens privados al frontend o al repositorio.

## Validación

El workflow de BRIFAN ejecuta instalación de dependencias, TypeScript y build de producción. No ejecuta actualmente pruebas de integración contra Supabase ni pruebas de navegador. Las operaciones reales de Auth, Storage, comentarios y moderación deben validarse en un entorno de prueba con cuentas de prueba, nunca con datos reales de usuarios.
