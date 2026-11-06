# BRIFAN TECH

<p align="center">
  <img src="docs/images/brifan-tech-preview.svg" alt="Vista conceptual de BRIFAN TECH" width="100%">
</p>

**Explora. Aprende. Comparte.** Una plataforma tecnológica comunitaria para descubrir, publicar y compartir conocimiento, tutoriales, guías, recursos y experiencias del mundo IT.

[Repositorio](https://github.com/JOSEFRO/BRIFAN-TECH) · [Reportar un problema](https://github.com/JOSEFRO/BRIFAN-TECH/issues)

## Visión

BRIFAN TECH busca ser una biblioteca tecnológica comunitaria con contenido organizado por áreas, perfiles de autores, búsqueda, recursos descargables y herramientas de aprendizaje.

## Stack tecnológico

- React + TypeScript + Vite
- Tailwind CSS 4
- Supabase: PostgreSQL, Auth y Storage
- Lucide React

## Funcionalidades identificadas en el código

- Registro e inicio de sesión con Supabase Auth.
- Publicaciones y flujo de moderación.
- Comentarios y favoritos para usuarios autenticados.
- Lectura de adjuntos mediante enlaces firmados de Supabase Storage.
- Panel/consultas de administración basadas en el rol del perfil.

> La disponibilidad real de cada función depende de que el proyecto Supabase tenga aplicadas las migraciones, políticas RLS, buckets y variables de entorno correspondientes.

## Vista previa

La imagen de `docs/images/` es una maqueta conceptual de la interfaz para documentar el producto. No representa datos reales ni una captura de producción.

## Requisitos

- Node.js 20 LTS o una versión compatible con la versión de Vite del proyecto.
- npm.
- Un proyecto Supabase propio con las migraciones y buckets requeridos.

## Instalación local

1. Descarga el repositorio con **Code → Download ZIP**, o clónalo:

```bash
git clone https://github.com/JOSEFRO/BRIFAN-TECH.git
cd BRIFAN-TECH
```

2. Instala dependencias:

```bash
npm install
```

3. Crea un archivo `.env.local` en la raíz, tomando como referencia `.env.example`:

```env
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=TU_CLAVE_PUBLICA
```

4. Inicia el servidor de desarrollo:

```bash
npm run dev
```

5. Abre la dirección local que Vite muestre en la terminal, normalmente `http://localhost:5173`.

## Compilar para producción

```bash
npm run build
npm run preview
```

La carpeta de salida es normalmente `dist/`. Consulta los scripts reales de `package.json` si cambian entre versiones.

## Configuración de Supabase

Antes de probar registro, publicaciones, comentarios o archivos:

1. Crea un proyecto en Supabase.
2. Revisa y aplica las migraciones SQL incluidas en el repositorio, en orden.
3. Configura las políticas de Row Level Security (RLS).
4. Crea/configura los buckets de Storage con los permisos previstos.
5. Copia la URL y la clave pública del proyecto a `.env.local`.
6. Nunca pongas la clave `service_role` en el frontend ni la subas a GitHub.
7. Verifica las reglas de acceso con cuentas de prueba de usuario y administrador.

No publiques credenciales, tokens ni archivos `.env`.

## Documentación

- Revisa la carpeta `supabase/` para el esquema y migraciones.
- Revisa `.env.example` para las variables necesarias.
- Consulta `package.json` para los comandos disponibles.

## Estado del proyecto

El repositorio contiene una base funcional de frontend y conexión a Supabase. Antes de anunciarlo como servicio de producción, deben completarse pruebas integrales de permisos RLS, moderación, almacenamiento, accesibilidad, manejo de errores y despliegue.

## Seguridad

- La clave pública de Supabase puede utilizarse en el cliente solo con RLS correctamente configurado.
- La clave `service_role` es secreta y nunca debe incluirse en código cliente.
- Las acciones administrativas deben validarse también en políticas/backend; ocultar botones en React no constituye control de acceso.
- No subas datos personales ni credenciales de usuarios a issues o commits.

## Contribuciones

Abre un issue describiendo el problema o la mejora. Para cambios grandes, crea una rama y envía un Pull Request con pasos de prueba.

## Licencia

No se ha identificado una licencia de reutilización en este repositorio. Salvo autorización del propietario, el código y los recursos permanecen reservados.
