<div align="center">

<img src="https://d8j0ntlcm91z4.cloudfront.net/user_3MJ8xX039ib9919oo3CFVd7NjMx/hf_20261119_141623_29dd20c4-2d49-42c4-ad5a-7d7c102f3920.webp" alt="Arte conceptual de BRIFAN TECH" width="100%">

# BRIFAN TECH

### Explora. Aprende. Comparte.

**Plataforma web para consultar, crear y compartir conocimiento tecnológico.**

[🌐 Abrir plataforma](https://josefro.github.io/BRIFAN-TECH/) · [Código fuente](https://github.com/JOSEFRO/BRIFAN-TECH) · [Incidencias](https://github.com/JOSEFRO/BRIFAN-TECH/issues)

![Estado](https://img.shields.io/badge/estado-desarrollo%20activo-blue)
![React](https://img.shields.io/badge/React-19-149ECA?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)
![Supabase](https://img.shields.io/badge/backend-Supabase-3ECF8E?logo=supabase)

</div>

## 1. Descripción del producto

BRIFAN TECH es una plataforma web orientada a la divulgación y el aprendizaje tecnológico. Reúne contenidos sobre redes, ciberseguridad, programación, inteligencia artificial y sistemas.

**Es un sitio web que se utiliza desde el navegador; no requiere instalar una aplicación.**

## 2. Funcionalidades y módulos

| Módulo | Objetivo |
|---|---|
| Exploración | Descubrir artículos, categorías y recursos. |
| Biblioteca técnica | Consultar guías con texto estructurado, imágenes y bloques de código. |
| Editor | Redactar y previsualizar contenido enriquecido. |
| Cuentas | Gestionar sesiones mediante autenticación. |
| Comunidad | Comentarios y marcadores, sujetos a permisos y configuración. |
| Administración | Gestionar contenido y moderación según el rol autorizado. |

La disponibilidad de cada función debe confirmarse en la versión desplegada y en sus servicios backend. La presencia de un componente visual no implica que su flujo completo esté habilitado.

## 3. Arquitectura y tecnologías

- React 19 y TypeScript.
- Vite 7 y Tailwind CSS 4.
- Supabase Auth y PostgreSQL.
- Supabase Storage.
- TipTap para edición enriquecida.
- Lucide React para iconografía.

### Integraciones y protocolos

- HTTPS para el acceso al sitio y las comunicaciones remotas.
- API de Supabase sobre HTTPS.
- PostgreSQL como motor de persistencia.
- Row Level Security (RLS) como capa de autorización de datos.
- Variables de entorno para configuración del cliente.

## 4. Requisitos

- Node.js 20.19 o superior, compatible con Vite 7.
- npm.
- Proyecto Supabase configurado.
- Acceso a las migraciones y políticas de base de datos del proyecto.

## 5. Instalación y ejecución

```bash
git clone https://github.com/JOSEFRO/BRIFAN-TECH.git
cd BRIFAN-TECH
npm install
```

Crea `.env.local` a partir de `.env.example` y configura los valores públicos del proyecto:

```env
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=TU_CLAVE_PUBLICA
```

Ejecuta los comandos:

```bash
npm run dev
npm run build
npm run preview
```

## 6. Seguridad

- Nunca incluyas claves `service_role`, contraseñas ni secretos en el frontend.
- Aplica RLS a todas las tablas expuestas al cliente.
- Comprueba permisos de lectura y escritura en cada bucket de Storage.
- Valida roles y autorizaciones en el backend; ocultar botones no es un control de seguridad.
- Limita tipos, tamaños y nombres de archivos cargados.
- Usa URLs HTTPS y políticas de contenido apropiadas.
- Prueba los flujos con cuentas de usuario y administración independientes.

## 7. Verificación y calidad

Antes de una publicación se deben comprobar:

- Instalación reproducible y compilación TypeScript/Vite.
- Registro, inicio de sesión y cierre de sesión.
- Creación, edición y eliminación de publicaciones.
- Permisos de usuario y administración.
- Comentarios, marcadores y archivos adjuntos.
- Estados de carga, error y ausencia de contenido.
- Accesibilidad, navegación por teclado y diseño responsive.

## 8. Publicación

- Sitio: [https://josefro.github.io/BRIFAN-TECH/](https://josefro.github.io/BRIFAN-TECH/)
- Rama de publicación: `main`.
- Automatización: [GitHub Actions](https://github.com/JOSEFRO/BRIFAN-TECH/actions).
- Configuración: [.github/workflows/deploy.yml](.github/workflows/deploy.yml).

El éxito de una compilación no certifica por sí solo la seguridad de Supabase ni todos los flujos funcionales.

## 9. Estado del proyecto

BRIFAN TECH continúa en desarrollo. La plataforma tiene una base React/TypeScript y una integración con Supabase; las funciones que dependen de autenticación, RLS, Storage y roles requieren pruebas de extremo a extremo antes de considerarse listas para producción.

## 10. Licencia

No se ha incorporado una licencia de reutilización. El código y los recursos permanecen reservados a su titular salvo autorización expresa.
