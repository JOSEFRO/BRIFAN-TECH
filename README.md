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
| Hosting | GitHub Pages (rama `main`) |

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

Requisitos: Node.js 22 o superior y npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Configura en `.env.local`:

```dotenv
VITE_SUPABASE_URL=https://TU-PROJECT-REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=TU_CLAVE_PUBLISHABLE
```

El repositorio todavía no incluye `package-lock.json`. Mientras se incorpora el lockfile validado, CI usa `npm install` como alternativa temporal; cuando el archivo esté presente, CI ejecuta `npm ci`. No se debe presentar la instalación actual como totalmente reproducible hasta que el lockfile se agregue y se valide.

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

## Variables de GitHub Actions

Configura en **Settings → Secrets and variables → Actions → Variables**:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

La clave publishable está diseñada para uso en cliente y no equivale a una clave privilegiada. Nunca incluyas `service_role`, `sb_secret` ni contraseñas en el frontend, el repositorio o los logs.

## Despliegue

- Los cambios en `main` disparan el workflow de GitHub Pages.
- Vite utiliza `/BRIFAN-TECH/` cuando `GITHUB_PAGES=true`.
- Los pull requests hacia `main` ejecutan validación de TypeScript y build.
- Para previsualizar una rama, se utiliza un deployment Preview independiente; no modifica el despliegue de producción.

## Seguridad y mantenimiento

- RLS está habilitado en las siete tablas públicas.
- Los roles y permisos administrativos se deben validar en la base de datos, no solo en la interfaz.
- No subir archivos `.env`, claves privilegiadas ni credenciales.
- Los cambios de esquema, políticas RLS, buckets y Auth requieren revisión explícita y aprobación separada.
