# BRIFAN TECH

<p align="center">
  <img src="docs/images/brifan-tech-preview.svg" alt="Vista conceptual de la plataforma BRIFAN TECH" width="100%">
</p>

**Explora. Aprende. Comparte.** BRIFAN TECH es una plataforma web comunitaria para descubrir, leer y compartir conocimiento tecnológico. Se utiliza directamente desde el navegador: no requiere instalar una aplicación en el equipo para acceder a la web.

[Ver código fuente](https://github.com/JOSEFRO/BRIFAN-TECH) · [Reportar un problema](https://github.com/JOSEFRO/BRIFAN-TECH/issues)

## Qué ofrece

- Exploración de recursos por categorías: redes, ciberseguridad, programación, IA, sistemas, bases de datos y más.
- Búsqueda y lectura de guías, tutoriales y recursos.
- Cuentas de usuario mediante Supabase Auth.
- Publicación de contenido con revisión/moderación.
- Comentarios y favoritos para usuarios autenticados.
- Adjuntos privados servidos mediante enlaces firmados de Supabase Storage.
- Herramientas de administración basadas en el rol del perfil.

> La disponibilidad de las funciones conectadas depende de la configuración de Supabase, las migraciones SQL, las políticas RLS y los buckets. La imagen de vista previa es conceptual y no debe confundirse con una captura del contenido publicado. Si la biblioteca no logra consultar Supabase, la interfaz muestra un estado de error en lugar de presentar contenido de ejemplo como si fuera contenido real.

## Experiencia y diseño

La interfaz utiliza una identidad visual cinematográfica en azul noche y rojo eléctrico, con profundidad 3D, iluminación volumétrica y microinteracciones. Las áreas y las tarjetas de recursos incorporan fotografías temáticas de Unsplash con carga diferida, capas de contraste y fallback de color si una imagen externa no responde. Las animaciones respetan la preferencia del sistema por movimiento reducido.

## Referencias visuales

Las fotografías temáticas se sirven desde imágenes de Unsplash. Son referencias ilustrativas por categoría y no representan instalaciones, equipos ni personal de BRIFAN TECH. La ilustración SVG del repositorio es una maqueta conceptual, no una captura real del sitio.

## Tecnologías

- React 19 + TypeScript + Vite 7
- Tailwind CSS 4
- Supabase: Auth, PostgreSQL y Storage
- Lucide React

## Ejecutar en desarrollo

Requisitos: Node.js compatible con Vite 7 y npm.

```bash
git clone https://github.com/JOSEFRO/BRIFAN-TECH.git
cd BRIFAN-TECH
npm install
```

Crea `.env.local` en la raíz a partir de `.env.example`:

```env
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=TU_CLAVE_PUBLICA
```

Luego:

```bash
npm run dev
npm run build
npm run preview
```

La web pública, cuando está desplegada, se abre desde el navegador sin instalación. Los comandos anteriores son únicamente para desarrollo local.

## Configuración y seguridad de Supabase

1. Aplica las migraciones incluidas en `supabase/` en el orden indicado.
2. Configura y verifica las políticas Row Level Security (RLS).
3. Crea los buckets requeridos y valida sus permisos.
4. Prueba con cuentas normales y de administración.
5. Mantén la clave `service_role` fuera del frontend, de los archivos públicos y de Git.

La clave pública del cliente no sustituye las políticas de acceso del servidor. Ocultar controles en la interfaz tampoco es una medida de autorización.

## Estado del proyecto

Proyecto en evolución. El código incluye una base de interfaz y flujos conectados a Supabase; antes de considerarlo un servicio de producción, conviene completar pruebas de permisos, moderación, adjuntos, accesibilidad, rendimiento y recuperación ante errores.

## Licencia

No se ha añadido una licencia de reutilización. El código y los recursos permanecen reservados a su propietario salvo autorización expresa.
