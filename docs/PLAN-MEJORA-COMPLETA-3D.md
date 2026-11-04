# BRIFAN TECH — Plan de mejora integral 3D

## Decisiones aprobadas
- Alcance: completo.
- Prioridad: equilibrada entre estabilidad, seguridad, aprendizaje, comunidad y experiencia.
- Dirección visual: 3D premium, tecnológica, oscura y accesible.
- Base de datos: conservar el proyecto Supabase existente; no crear una base adicional.
- Producción: `main` permanece protegida durante el trabajo. Los cambios se desarrollan en una rama independiente y se revisan mediante Pull Request.

## Objetivo
Convertir BRIFAN TECH en una plataforma tecnológica completa para aprender, publicar, descubrir recursos y participar en una comunidad, manteniendo los flujos existentes y evitando cambios destructivos en datos o permisos.

## Fase 0 — Preparación y línea base
1. Revisar el estado actual de `main` y los cambios de ramas anteriores.
2. Inventariar páginas, componentes, hooks, rutas, dependencias y variables de entorno.
3. Confirmar las tablas, políticas RLS, buckets y funciones que utiliza la aplicación.
4. Definir criterios de aceptación y ejecutar la compilación base.
5. No copiar cambios de prototipos anteriores sin revisar su diff y compatibilidad.

**Aceptación:** inventario actualizado, compilación base registrada y ninguna modificación de producción.

## Fase 1 — Estabilidad, seguridad y arquitectura
1. Corregir regex de normalización y separación de palabras.
2. Corregir dependencias de memoización y estados de carga.
3. Separar responsabilidades de la aplicación monolítica en componentes, hooks y módulos.
4. Revisar autenticación, autorización, validaciones y manejo de errores.
5. Revisar RLS, funciones SECURITY DEFINER, permisos EXECUTE y políticas superpuestas.
6. Mejorar el flujo de publicación y carga de archivos con compensación de errores.
7. Validar archivos, tipos MIME, tamaño y rutas de Storage.
8. Revisar dependencias y configuración de compilación.

**Aceptación:** flujos actuales conservados, errores manejados, permisos revisados y build sin errores.

## Fase 2 — Sistema visual 3D
1. Crear tokens de diseño: color, tipografía, radios, sombras, profundidad y espaciado.
2. Diseñar navegación, encabezado, pie de página y estructura responsive.
3. Crear portada con hero 3D optimizado y llamadas a la acción claras.
4. Crear tarjetas con capas, profundidad, iluminación y estados hover/focus.
5. Incorporar movimiento moderado, respetando `prefers-reduced-motion`.
6. Optimizar imágenes, carga diferida y alternativas para dispositivos de bajo rendimiento.
7. Verificar contraste, navegación por teclado y estados de foco.

**Aceptación:** identidad coherente en escritorio y móvil, efectos fluidos y accesibles, sin penalización excesiva de rendimiento.

## Fase 3 — Biblioteca y experiencia de lectura
1. Mejorar catálogo, búsqueda, filtros, categorías y etiquetas.
2. Crear estados vacíos, carga, error y paginación.
3. Mejorar lector con Markdown sanitizado, tabla de contenido y bloques de código.
4. Conservar adjuntos, favoritos y enlaces relacionados.
5. Evitar renderizado de HTML no confiable.

**Aceptación:** lectura segura y navegación consistente en artículos y recursos.

## Fase 4 — Aprendizaje
1. Presentar rutas por especialidad y nivel.
2. Estructurar módulos, lecciones y recursos reutilizando el contenido existente.
3. Registrar progreso solo con el modelo de datos existente o con migraciones revisadas y aprobadas.
4. Añadir laboratorios guiados y listas de pasos.
5. Mostrar progreso y próximos pasos.

**Aceptación:** una ruta puede recorrerse y el progreso se representa de forma fiable, sin duplicar datos.

## Fase 5 — Comunidad
1. Mejorar publicaciones, preguntas, comentarios y respuestas.
2. Añadir perfiles y actividad pública respetando privacidad.
3. Integrar reacciones, favoritos y reportes existentes.
4. Definir estados de moderación y mensajes de error claros.
5. Prevenir spam y validar entradas.

**Aceptación:** participación controlada por permisos y moderación funcional.

## Fase 6 — Administración y participación
1. Panel de moderación para contenido pendiente y reportes.
2. Gestión segura de categorías y contenido.
3. Estadísticas agregadas, sin exponer información privada.
4. Logros e insignias vinculados a acciones verificables.
5. Restringir operaciones administrativas a roles autorizados.

**Aceptación:** ninguna operación administrativa queda disponible a usuarios no autorizados.

## Fase 7 — Calidad y entrega
1. Ejecutar build y pruebas disponibles.
2. Probar autenticación, publicación, archivos, lectura, favoritos, comentarios y moderación.
3. Revisar RLS con usuarios de distintos roles.
4. Revisar consola, accesibilidad, responsive y rendimiento.
5. Documentar variables de entorno sin incluir secretos.
6. Preparar Pull Request con capturas, resumen, pruebas, riesgos y migraciones propuestas.

**Aceptación:** Pull Request revisable; no se fusiona ni despliega sin aprobación expresa.

## Restricciones y salvaguardas
- No modificar `main` directamente.
- No desplegar ni fusionar automáticamente.
- No crear otra base de datos.
- No cambiar secretos ni publicar credenciales.
- No ejecutar SQL destructivo ni alterar políticas RLS sin revisión y autorización.
- Toda migración necesaria debe quedar versionada, explicada y revisable antes de aplicarse.
- Mantener compatibilidad con las tablas y flujos actuales siempre que sea técnicamente seguro.

## Orden de ejecución
Preparación → Estabilidad/seguridad → Sistema visual → Biblioteca/lector → Aprendizaje → Comunidad → Administración/logros → Pruebas y Pull Request.
