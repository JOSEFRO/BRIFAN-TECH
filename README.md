# BRIFAN TECH

**Explora. Aprende. Comparte.** Una plataforma tecnológica para descubrir, publicar y compartir conocimiento, tutoriales, guías, recursos y experiencias de la comunidad IT.

## Visión
BRIFAN TECH no será solamente un blog: será una biblioteca tecnológica comunitaria con contenido organizado por áreas, perfiles de autores, búsqueda, recursos descargables y herramientas de aprendizaje.

## Stack
- React + TypeScript + Vite
- Tailwind CSS 4
- Supabase (PostgreSQL, Auth, Storage y Row Level Security)
- Lucide React

## Estado actual
- [x] Repositorio y proyecto Supabase creados.
- [x] Primera interfaz responsive con navegación, categorías y búsqueda local de muestra.
- [x] Cliente Supabase y variables de entorno de ejemplo.
- [x] Esquema inicial: perfiles, categorías, artículos, etiquetas, comentarios y favoritos.
- [x] Políticas RLS y buckets privados/públicos con permisos iniciales.
- [x] Diez categorías iniciales cargadas en la base de datos.
- [ ] Sincronizar la migración SQL al repositorio.
- [ ] Registro, inicio de sesión y perfiles en la interfaz.
- [ ] Editor y publicación de contenido conectados a Supabase.
- [ ] Búsqueda real, comentarios, favoritos y moderación.

## Desarrollo local

    npm install
    cp .env.example .env.local
    npm run dev

Completa `.env.local` con la URL y la clave publishable del proyecto Supabase. Nunca coloques una clave `service_role` o `sb_secret` en el frontend ni en GitHub.

## Supabase
- Project ref: `htjzmsajubsyvacynyht`
- Región: `us-east-1`
- Project URL: `https://htjzmsajubsyvacynyht.supabase.co`

## Estructura inicial
- `src/lib/supabase.ts` — cliente de Supabase.
- `src/App.tsx` — landing y primera navegación.
- `src/main.tsx` — punto de entrada.
- `src/styles.css` — diseño visual.

## Seguridad
- RLS está habilitado en todas las tablas públicas creadas.
- Los usuarios solo pueden modificar los campos permitidos de su perfil.
- Los autores pueden crear borradores y enviar contenido a revisión; la publicación queda reservada a moderación.
- Los archivos de artículos usan un bucket privado; los avatares usan un bucket público con carpetas por usuario.
- Los permisos administrativos se comprueban en la base de datos, no solo en la interfaz.
