# Supabase — BRIFAN TECH

Project ref: `htjzmsajubsyvacynyht`  
Region: `us-east-1`

## Estado remoto verificado

El proyecto remoto está activo. El esquema público contiene estas tablas, todas con RLS habilitado:

- `profiles`
- `categories`
- `articles`
- `tags`
- `article_tags`
- `comments`
- `bookmarks`

Buckets existentes:

- `brifan-avatars` — público, destinado a avatares.
- `brifan-articles` — privado, destinado a archivos de publicaciones.

Migraciones registradas en el historial remoto:

- `20261103161923_initial_content_platform_schema`
- `20261103191248_tighten_function_permissions_and_add_fk_indexes`

## Importante: historial y archivos SQL

El historial remoto confirma que las dos migraciones anteriores fueron aplicadas, pero sus archivos SQL originales no estaban presentes en el repositorio durante la auditoría. No se han inventado archivos retroactivos ni se ha intentado volver a ejecutar DDL sobre producción.

Antes de adoptar Supabase CLI como flujo de migraciones:

1. Recupera/exporta los SQL originales correspondientes a esas versiones desde el historial de desarrollo o una copia de seguridad.
2. Colócalos en `supabase/migrations/` conservando exactamente sus versiones y nombres.
3. Compara el esquema local con el proyecto remoto.
4. Ejecuta una verificación de migraciones antes de aplicar cualquier cambio nuevo.

No ejecutes una migración inicial nueva contra el proyecto existente: podría duplicar objetos o modificar permisos de producción.

## Variables de entorno

En desarrollo local, copia `.env.example` a `.env.local` y configura:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

La clave publishable puede utilizarse en el navegador junto con políticas RLS correctas. Nunca agregues `service_role`, `sb_secret`, contraseñas ni tokens privados al frontend o al repositorio.

## Funcionalidad conectada actualmente

- Registro e inicio de sesión con Supabase Auth.
- Lectura de publicaciones con estado `published`.
- Favoritos por usuario en `bookmarks`.
- Creación automática de perfil mediante el trigger de Auth.

El editor, la gestión completa de perfiles, los comentarios y la moderación todavía requieren implementación en la aplicación.
