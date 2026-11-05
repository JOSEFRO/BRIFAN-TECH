# BRIFAN TECH

**Explora. Aprende. Comparte.** Plataforma tecnológica para aprender, publicar y compartir guías, tutoriales y experiencias de la comunidad IT.

## Estado del proyecto

BRIFAN TECH combina una experiencia de bienvenida 3D, una biblioteca técnica, rutas de aprendizaje, comunidad y funciones de publicación moderada.

- Interfaz: React 19, TypeScript, Vite 7 y Tailwind CSS 4.
- Backend: Supabase (PostgreSQL, Auth, Storage y Row Level Security).
- Biblioteca: 10 guías locales de demostración; los artículos publicados se consultan desde Supabase.
- Aprendizaje: tres rutas con seguimiento de progreso guardado localmente.
- Comunidad: perfiles y actividad reciente consultados desde Supabase.
- Publicación: envío de artículos a revisión, adjuntos privados y moderación administrativa.
- Estado de datos auditado el 5 de noviembre de 2026: la tabla `articles` tenía 0 filas; por eso la biblioteca mostraba las guías locales.

## Stack

| Área | Tecnología |
|---|---|
| UI | React 19 + TypeScript |
| Build | Vite 7 |
| Estilos | Tailwind CSS 4 + CSS propio |
| Iconos | Lucide React |
| Backend | Supabase JS v2 |
| Hosting | GitHub Pages (rama `main`) y proyecto Vercel Preview |

## Estructura principal

- `src/App.tsx` — flujo principal, autenticación, biblioteca, publicación, lectura, comentarios y administración.
- `src/components/WelcomeExperience.tsx` — entrada 3D.
- `src/components/Header.tsx` — navegación y acciones de cuenta.
- `src/components/LearningHub.tsx` — rutas de aprendizaje y progreso local.
- `src/components/CommunityHub.tsx` — miembros y actividad comunitaria.
- `src/components/GuideMarkdown.tsx` — renderizado de guías Markdown.
- `src/data/learningGuides.ts` — diez guías de demostración.
- `src/lib/supabase.ts` — inicialización del cliente Supabase.
- `src/styles.css` — diseño visual y responsive.
- `vite.config.ts` — configuración Vite y ruta base de GitHub Pages.
- `.github/workflows/ci.yml` — validación de PR hacia `main`.
- `.github/workflows/deploy.yml` — despliegue de GitHub Pages al actualizar `main`.

## Desarrollo local

Requisitos: Node.js 22.x y npm.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Edita `.env.local` y reemplaza los valores de ejemplo por la URL y la clave publishable de tu proyecto Supabase:

```dotenv
VITE_SUPABASE_URL=https://TU-PROJECT-REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=TU_CLAVE_PUBLISHABLE
```

Si no configuras Supabase, la aplicación puede arrancar con sus datos locales de demostración, pero las funciones remotas no estarán disponibles.

El repositorio incluye `package-lock.json` (lockfile v3). CI y el despliegue de GitHub Pages instalan dependencias con `npm ci` para mantener instalaciones reproducibles. La versión de Node está fijada en `.nvmrc` y en el proyecto Preview de Vercel.

## Supabase

- Project ref: `htjzmsajubsyvacynyht`
- Región: `us-east-1`
- Tablas públicas con RLS activo: `profiles`, `categories`, `articles`, `tags`, `article_tags`, `comments`, `bookmarks`.
- Buckets: `brifan-avatars` (público) y `brifan-articles` (privado).

### Historial remoto de migraciones

La auditoría de solo lectura encontró seis migraciones aplicadas en Supabase:

1. `20261103161923_initial_content_platform_schema`
2. `20261103191248_tighten_function_permissions_and_add_fk_indexes`
3. `20261103194850_grant_ceo_role_and_expand_article_uploads`
4. `20261103195022_allow_public_read_of_published_article_attachments`
5. `20261103200957_protect_profile_roles_from_self_escalation`
6. `20261105013258_tighten_profile_trigger_and_article_storage`

Los archivos SQL originales aún no se han incorporado al repositorio. No recrees ni vuelvas a aplicar migraciones sobre producción sin comparar primero el historial remoto y los archivos exactos.

## Variables de GitHub Actions y Vercel

Configura en GitHub: **Settings → Secrets and variables → Actions → Variables**.

| Variable | Uso |
|---|---|
| `VITE_SUPABASE_URL` | URL pública del proyecto Supabase |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Clave publishable de Supabase |

Configura los mismos dos valores en Vercel para los entornos Preview y Production que realmente vayas a utilizar. Comprueba que estén disponibles en Preview antes de validar la aplicación.

La clave publishable está diseñada para uso en cliente y no equivale a una clave privilegiada. Nunca incluyas `service_role`, `sb_secret` ni contraseñas en el frontend, el repositorio o los logs. No publiques los valores de las variables en capturas o registros.

## Despliegue

- Los cambios en `main` disparan el workflow de GitHub Pages.
- Vite utiliza `/BRIFAN-TECH/` cuando `GITHUB_PAGES=true`.
- Los pull requests hacia `main` ejecutan validación de TypeScript y build.
- El proyecto de Vercel debe tener instalada la integración oficial de GitHub y estar conectado a este repositorio para crear previews automáticos por rama.
- Las ramas distintas de la rama de producción generan Preview deployments; no deben asignarse al dominio de producción.
- No se debe fusionar el PR hasta que la vista previa y las pruebas funcionales hayan sido revisadas.

## Seguridad y mantenimiento

- RLS está habilitado en las siete tablas públicas.
- Los roles y permisos administrativos se deben validar en la base de datos, no solo en la interfaz.
- No subir archivos `.env`, claves privilegiadas ni credenciales.
- Los cambios de esquema, políticas RLS, buckets y Auth requieren revisión explícita y aprobación separada.
