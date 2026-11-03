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
- [x] Primera interfaz responsive y navegación visual.
- [x] Base del cliente Supabase y variables de entorno de ejemplo.
- [ ] Esquema de datos, políticas RLS y buckets de Storage.
- [ ] Registro, inicio de sesión y perfiles.
- [ ] Publicación y edición de contenido.
- [ ] Búsqueda, comentarios, favoritos y moderación.

## Desarrollo local

    npm install
    cp .env.example .env.local
    npm run dev

Completa .env.local con la URL y la clave publishable del proyecto Supabase. Nunca coloques una clave service_role o sb_secret en el frontend ni en GitHub.

## Supabase
- Project ref: htjzmsajubsyvacynyht
- Región: us-east-1

## Estructura inicial
- src/lib/supabase.ts
- src/App.tsx
- src/main.tsx
- src/styles.css

## Principios
- Seguridad desde la base: RLS en todas las tablas expuestas.
- Los usuarios controlan su contenido y perfil.
- El contenido público se consulta sin iniciar sesión; publicar requiere autenticación.
- Moderación y permisos administrativos se validan en la base de datos, nunca solo en la interfaz.
