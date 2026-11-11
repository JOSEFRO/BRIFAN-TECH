# Lista de verificación de publicación — BRIFAN TECH

## Verificación automatizada

- [x] Compilación de producción en GitHub Actions para el commit de documentación más reciente.
- [x] Despliegue de GitHub Pages completado.
- [x] Documentación y arquitectura enlazadas desde README.

Ejecución revisada: [Deploy BRIFAN TECH to GitHub Pages](https://github.com/JOSEFRO/BRIFAN-TECH/actions).

## Pruebas funcionales manuales pendientes

- [ ] Registro, inicio de sesión y cierre de sesión.
- [ ] Recuperación de contraseña.
- [ ] Lectura de una guía con encabezados, listas, tablas, enlaces, imágenes y código.
- [ ] Inserción de video YouTube y validación de URL.
- [ ] Crear, editar y guardar un artículo.
- [ ] Comentarios y marcadores con dos cuentas distintas.
- [ ] Verificar que un usuario no pueda editar ni borrar contenido ajeno.
- [ ] Verificar permisos administrativos y RLS desde Supabase.
- [ ] Carga y lectura de imágenes según las reglas de cada bucket.
- [ ] Navegación móvil, teclado, contraste y movimiento reducido.

## Evidencia visual que debe incorporarse

Las capturas deben tomarse de la aplicación real publicada, sin datos personales:
1. Inicio de BRIFAN en escritorio (1440 px).
2. Inicio en móvil (390 px).
3. Lectura de una guía técnica.
4. Editor abierto con vista previa.
5. Panel de cuenta/comunidad, solo si está habilitado en producción.

Guardar las imágenes verificadas en `docs/screenshots/` y reemplazar este listado por enlaces a las capturas. No usar mockups conceptuales como prueba de funcionalidad.

## Criterio de salida

BRIFAN puede considerarse listo para una versión pública cuando los flujos anteriores se hayan probado y no existan fallos críticos de permisos, publicación o navegación.
