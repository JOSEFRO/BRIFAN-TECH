# Auditoría técnica y de seguridad — BRIFAN TECH

**Fecha de revisión:** 24 de noviembre de 2026  
**Alcance:** repositorio `main`, sitio publicado, workflows de GitHub y configuración remota de Supabase consultada en modo de solo lectura.

## Resumen ejecutivo

BRIFAN TECH utiliza React 19, TypeScript, Vite 7, Tailwind CSS 4, Tiptap 3 y Supabase Auth, PostgreSQL y Storage. El sitio está publicado en GitHub Pages.

La arquitectura es adecuada para una plataforma editorial estática conectada a servicios gestionados. El principal riesgo pendiente no está en el cliente React, sino en la diferencia entre algunas preferencias que se muestran en la interfaz y los controles que realmente aplica la base de datos.

## Hallazgos confirmados

| Severidad | Área | Evidencia y efecto |
|---|---|---|
| Alta | Privacidad de perfiles | La política `Profiles are public` permite SELECT público sobre `public.profiles` con condición `true`. La preferencia `profile_visibility` se almacena en `user_preferences`, pero no modifica esa política. Elegir “Privado” no vuelve privado el perfil. |
| Media | Auth | El asesor de Supabase informa que Leaked Password Protection está deshabilitado. La protección contra contraseñas comprometidas debe activarse desde la configuración de Auth. |
| Media | Contenido | La tabla `articles` no tenía publicaciones al momento de la consulta. La aplicación mostraba una biblioteca vacía aunque dispone de guías locales de inicio. |
| Media | Pruebas | El workflow de CI ejecuta instalación, TypeScript y build; no ejecuta pruebas de navegador ni de integración autenticada para Auth, Storage, comentarios o moderación. |
| Media | Dependencias | No se encontró `package-lock.json`; las instalaciones con `npm install` no quedan fijadas a un árbol reproducible. |
| Baja | Políticas RLS | El asesor detecta políticas permisivas superpuestas en `articles`, `categories` y `tags`. Es un aviso de optimización; las políticas se combinan de forma permisiva y deben revisarse con pruebas antes de consolidarlas. |
| Baja | Índices | El asesor informa tres índices sin uso observado. No se recomienda borrarlos sin revisar consultas y carga real. |

## Controles verificados

- RLS está habilitado en las ocho tablas del esquema público.
- Las políticas de artículos limitan la creación y edición de autores a sus propios borradores o publicaciones pendientes; la moderación administrativa tiene una política separada.
- Los comentarios requieren una sesión autenticada para insertar y están vinculados a artículos publicados.
- Los favoritos están limitados al usuario propietario.
- El bucket `brifan-articles` es privado, limita archivos a 50 MiB y restringe tipos MIME.
- El bucket `brifan-avatars` es público, limita archivos a 5 MiB y permite imágenes JPEG, PNG y WebP.
- La política de perfiles públicos expone los campos de perfil definidos en la tabla, incluido el rol. No se encontró un campo de correo electrónico en esa tabla.
- El frontend utiliza una clave publishable de Supabase; no se encontró una clave `service_role` ni una clave `sb_secret` en los archivos inspeccionados.

## Restricciones de cambios de base de datos

El historial remoto registra ocho migraciones, pero sus archivos SQL originales no están versionados en el repositorio. No se debe reconstruir ni inventar una migración inicial sobre producción.

Antes de cambiar políticas de perfiles, Storage, funciones o índices:

1. Recuperar los SQL originales de las migraciones remotas o de una copia fiable.
2. Versionar y comparar el esquema local con el remoto.
3. Preparar una rama de desarrollo de Supabase y probar con cuentas separadas.
4. Verificar SELECT, INSERT, UPDATE y DELETE para usuarios anónimos, miembros, autores y administradores.
5. Revisar los asesores de seguridad y rendimiento antes de promover el cambio.

## Mejoras aplicadas en esta entrega

- La biblioteca muestra guías locales de inicio cuando Supabase responde correctamente pero aún no hay artículos publicados. Se identifican como contenido de muestra y no habilitan marcadores ni comentarios vinculados a registros inexistentes.
- El lector y la vista previa usan el mismo renderizador Markdown.
- Los enlaces Markdown aceptan únicamente HTTP/HTTPS y se abren con `noopener noreferrer`.
- Los videos se incrustan solo cuando el host pertenece a YouTube y el identificador tiene el formato esperado.
- Las imágenes Markdown remotas requieren HTTPS.
- El menú móvil comunica su estado a tecnologías de asistencia y se puede cerrar con Escape.
- Los controles de formulario reciben un indicador de foco visible.
- La documentación local usa el nombre correcto de la variable `VITE_SUPABASE_PUBLISHABLE_KEY`.

## Próximos pasos recomendados

1. Recuperar y versionar las migraciones originales.
2. Diseñar una política real de visibilidad de perfiles, con una vista pública de columnas permitidas o políticas RLS cuidadosamente probadas.
3. Activar Leaked Password Protection en Supabase Auth.
4. Añadir pruebas de navegador para registro, sesión, lectura, publicación, adjuntos, comentarios y moderación.
5. Incorporar un lockfile y usar `npm ci` en CI y despliegue.
6. Separar la lógica de datos y los flujos de artículos de `App.tsx` en módulos pequeños y tipados.
7. Evaluar búsqueda de servidor y carga diferida de cuerpos Markdown antes de ampliar el volumen de publicaciones.

## Límites de esta auditoría

Esta revisión no es una certificación de seguridad ni sustituye pruebas con cuentas reales de prueba. No se modificaron tablas, políticas RLS, buckets, claves, usuarios ni datos de producción. La configuración de protección de contraseñas requiere una acción administrativa en el Dashboard.
