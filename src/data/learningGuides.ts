/**
 * Biblioteca editorial de BRIFAN TECH.
 * Cada guía combina fundamentos, arquitectura, ejemplos, diagnóstico y práctica.
 * El contenido está pensado para aprendizaje en laboratorios propios o autorizados.
 */
export const learningGuides = [
  {
    id: 'guide-network-engineering',
    type: 'GUÍA TÉCNICA',
    title: 'Ingeniería de redes: arquitectura, switching y routing',
    category: 'Redes y conectividad',
    level: 'Intermedio',
    time: '45–60 min',
    excerpt: 'Diseña una LAN segmentada, entiende el recorrido de los paquetes y aprende a diagnosticar fallos por capas.',
    body: `# Ingeniería de redes: de la topología al diagnóstico

## 1. La red como sistema
Una red empresarial no es solo un conjunto de cables y switches. Es un sistema de transporte de datos con límites de confianza, dominios de broadcast, rutas, servicios y políticas. Antes de configurar, documenta quién necesita comunicarse, con qué servicio, desde dónde y bajo qué controles.

Una LAN suele cubrir un espacio limitado; una WAN interconecta sedes o redes distantes. Ethernet define gran parte de la comunicación cableada local, mientras que IP permite direccionar y enrutar paquetes entre redes.

## 2. Modelos OSI y TCP/IP aplicados
El modelo OSI divide la comunicación en siete capas: física, enlace, red, transporte, sesión, presentación y aplicación. TCP/IP agrupa esas funciones en acceso a red, Internet, transporte y aplicación.

Ejemplo de diagnóstico: si un equipo no tiene enlace físico, revisa cable, puerto, alimentación y negociación (capa física/enlace). Si tiene enlace pero no alcanza su gateway, revisa IP, máscara, VLAN y tabla ARP. Si llega al servidor por IP pero no por nombre, investiga DNS. Diagnosticar por capas evita cambiar configuraciones al azar.

## 3. Ethernet, MAC y switching
Un switch aprende direcciones MAC observando la MAC de origen de las tramas y asociándola al puerto de entrada. Su tabla CAM permite reenviar una trama unicast al puerto correcto. Si desconoce el destino, inunda la trama dentro de la VLAN correspondiente; las tramas broadcast también permanecen dentro de ese dominio.

Una VLAN crea un dominio lógico de capa 2. No sustituye el firewall ni cifra el tráfico: segmenta la red y permite separar grupos como administración, usuarios, invitados y servidores.

### Ejemplo de plan de VLAN
| VLAN | Área | Red de ejemplo | Gateway |
|---|---|---|---|
| 10 | Administración | 192.168.10.0/24 | 192.168.10.1 |
| 20 | Finanzas | 192.168.20.0/24 | 192.168.20.1 |
| 30 | Operaciones | 192.168.30.0/24 | 192.168.30.1 |
| 99 | Gestión | 192.168.99.0/24 | 192.168.99.1 |

Asigna puertos de acceso a una sola VLAN de usuario. Los enlaces trunk transportan varias VLAN mediante etiquetado IEEE 802.1Q. En ambos extremos del trunk deben coincidir las VLAN permitidas y la configuración de VLAN nativa.

## 4. Routing y camino del paquete
Un router conecta redes IP distintas. Al recibir un paquete, consulta su tabla de rutas y selecciona la coincidencia de prefijo más específica. Si no existe una ruta más específica, puede utilizar una ruta por defecto. El gateway de un host debe pertenecer a su segmento local.

En una red pequeña, el enrutamiento entre VLAN puede realizarse con un router-on-a-stick o con un switch multicapa. La primera opción utiliza una interfaz física y subinterfaces etiquetadas; la segunda realiza el routing en el propio switch.

## 5. Servicios esenciales
- DHCP asigna parámetros de red como dirección, máscara, gateway y DNS. El proceso clásico DORA comprende Discover, Offer, Request y Acknowledge.
- DNS traduce nombres a registros como A, AAAA, CNAME y MX. Una resolución puede fallar aunque exista conectividad IP.
- NTP sincroniza la hora; una hora incorrecta complica el análisis de logs y certificados.
- ARP relaciona direcciones IPv4 con direcciones MAC dentro del enlace local.

## 6. Método profesional de troubleshooting
1. Define el alcance: un usuario, una VLAN, una sede o todos los servicios.
2. Registra hora, equipo, dirección IP, gateway, DNS y mensaje exacto.
3. Comprueba enlace y estado de interfaz.
4. Verifica dirección, máscara, gateway y concesión DHCP.
5. Prueba gateway, destino por IP y destino por nombre, por separado.
6. Revisa VLAN, trunk, tabla MAC, ARP y rutas según el punto de fallo.
7. Cambia una variable a la vez, documenta el resultado y valida con el usuario.

Herramientas: 'ipconfig /all', 'ip addr', 'ip route', 'ping', 'tracert'/'traceroute', 'nslookup', 'dig' y la consulta de estado de interfaces del fabricante.

## 7. Laboratorio guiado
En Packet Tracer o un entorno propio, crea tres VLAN, conecta dos switches con un trunk y coloca un equipo en cada VLAN. Configura direccionamiento estático inicialmente. Comprueba que dos equipos de la misma VLAN se comunican y que equipos de VLAN distintas necesitan routing. Después incorpora DHCP y DNS de laboratorio.

**Evidencias:** diagrama, tabla de direccionamiento, tabla VLAN/puertos, pruebas de conectividad y explicación de un fallo que hayas provocado de forma controlada.

## 8. Reto de análisis
Un usuario recibe una dirección 169.254.x.x y no puede navegar, pero sus compañeros sí. Explica qué indica esa dirección, qué servicio investigarías primero, qué evidencias recopilarías y cómo descartarías un problema de VLAN o de servidor DHCP.

## 9. Glosario
Broadcast: trama enviada a todos los equipos de una VLAN. Gateway: siguiente salto para salir de la red local. Trunk: enlace que transporta múltiples VLAN. CIDR: notación de prefijos IP. MTU: tamaño máximo de unidad de transmisión. Latencia: tiempo que tarda un paquete en recorrer el trayecto.',
    color: 'blue',
  },
  {
    id: 'guide-cyber-defense',
    type: 'MANUAL DE DEFENSA',
    title: 'Ciberseguridad defensiva: riesgo, identidad y respuesta',
    category: 'Ciberseguridad',
    level: 'Intermedio',
    time: '40–55 min',
    excerpt: 'Construye un modelo de protección basado en activos, amenazas, controles, monitoreo y recuperación.',
    body: '# Ciberseguridad defensiva: proteger, detectar y recuperar

## 1. Seguridad basada en riesgo
La ciberseguridad busca preservar confidencialidad, integridad y disponibilidad. No existe una medida que elimine todo riesgo; el objetivo es reducirlo a un nivel aceptable y poder responder cuando un control falla.

Comienza por inventariar activos: identidades, equipos, aplicaciones, información, servicios y proveedores. Para cada activo identifica amenazas, debilidades, impacto y controles existentes. Una matriz sencilla puede puntuar probabilidad e impacto como bajo, medio o alto, siempre explicando el criterio.

## 2. Amenaza, vulnerabilidad y riesgo
Una amenaza es una circunstancia capaz de causar daño; una vulnerabilidad es una debilidad explotable; el riesgo combina probabilidad e impacto. Un parche pendiente no es automáticamente un incidente, pero sí una exposición que debe priorizarse según criticidad, disponibilidad de corrección y exposición del activo.

## 3. Identidad y control de acceso
Aplica mínimo privilegio: cada cuenta recibe solo los permisos necesarios para su función. Separa cuentas de uso diario y administración, elimina accesos al cambiar de puesto y revisa permisos periódicamente.

La autenticación multifactor combina factores diferentes, por ejemplo algo que sabes y algo que posees. Prefiere métodos resistentes al phishing cuando estén disponibles. Las contraseñas deben ser únicas, largas y almacenarse con gestores confiables; los sistemas deben protegerlas mediante funciones de hash adaptativas con salt, nunca en texto plano.

## 4. Endpoints y servidores
Mantén inventario, actualizaciones, cifrado de disco, protección antimalware, firewall local y bloqueo de sesión. Reduce software innecesario y limita privilegios administrativos. En servidores, deshabilita servicios no requeridos y documenta los cambios.

## 5. Segmentación y defensa en profundidad
Separa estaciones, servidores, invitados, administración y dispositivos IoT según su función. Define qué flujos necesitan comunicarse y bloquea el resto por defecto cuando sea viable. La segmentación limita el movimiento lateral, pero requiere reglas bien mantenidas y monitoreo.

## 6. Logs y detección
Centraliza eventos de autenticación, cambios administrativos, antivirus/EDR, firewall, DNS y aplicaciones críticas. Normaliza hora con NTP y define retención. Una alerta útil incluye activo, usuario, hora, evento, severidad y contexto; evita tratar cada alerta como incidente confirmado.

## 7. Respuesta a incidentes
Un flujo práctico comprende preparación, identificación, contención, erradicación, recuperación y lecciones aprendidas. Conserva evidencias, registra decisiones y sigue el procedimiento de la organización. En entornos reales, escala al equipo responsable; no improvises borrados ni alteres sistemas que deban investigarse.

## 8. Copias de seguridad y continuidad
Define RPO (cuánta información puedes permitirte perder) y RTO (cuánto tiempo puede tardar la recuperación). Mantén copias protegidas, separadas del entorno principal y prueba restauraciones. Una copia que nunca se ha restaurado no es una garantía.

## 9. Ejercicio de mesa
Escenario: varias cuentas reciben avisos de inicio de sesión inusual. Sin ejecutar acciones sobre sistemas ajenos, diseña el procedimiento interno: validar alertas, identificar cuentas afectadas, revisar sesiones y registros, escalar, proteger credenciales, comunicar el incidente y documentar el cierre.

## 10. Indicadores para mejorar
Mide porcentaje de activos inventariados, tiempo de aplicación de parches críticos, cobertura MFA, éxito de restauraciones, tiempo de detección y tiempo de recuperación. Los indicadores deben impulsar mejoras, no ocultar incidentes.

**Lecturas de referencia:** NIST Cybersecurity Framework 2.0, CIS Critical Security Controls y guías de seguridad de CISA. Consulta siempre las versiones oficiales vigentes.',
    color: 'violet',
  },
  {
    id: 'guide-web-engineering',
    type: 'RUTA DE DESARROLLO',
    title: 'Desarrollo web moderno: del navegador a producción',
    category: 'Programación',
    level: 'Intermedio',
    time: '45–60 min',
    excerpt: 'Comprende HTTP, arquitectura frontend/backend, APIs, validación, pruebas y despliegue.',
    body: '# Desarrollo web moderno: arquitectura y ciclo de entrega

## 1. Qué sucede al abrir una web
El navegador resuelve el dominio mediante DNS, establece una conexión con el servidor y negocia HTTPS mediante TLS. Luego envía una petición HTTP. La respuesta incluye un código de estado, cabeceras y, normalmente, un cuerpo con HTML, JSON, CSS, JavaScript o recursos multimedia.

HTTP es un protocolo sin estado por sí mismo. Cookies, sesiones y tokens permiten mantener contexto entre solicitudes, pero deben protegerse correctamente.

## 2. Frontend y backend
El frontend presenta la interfaz y gestiona interacciones. El backend aplica reglas de negocio, valida permisos, consulta datos y responde mediante APIs. La base de datos persiste información. Separar responsabilidades facilita probar y mantener el sistema.

HTML semántico aporta estructura accesible; CSS controla presentación; JavaScript/TypeScript implementa comportamiento. React organiza la interfaz mediante componentes y estado, pero no sustituye la validación del servidor.

## 3. APIs y contratos
Una API define rutas, métodos, parámetros, respuestas y errores. GET consulta, POST crea o ejecuta una operación, PUT reemplaza, PATCH modifica parcialmente y DELETE elimina. Los códigos HTTP comunican el resultado: 200, 201, 204, 400, 401, 403, 404, 409, 422 y 500 tienen significados distintos.

Ejemplo de respuesta JSON:
'''json
{
  "id": "ticket-1042",
  "status": "open",
  "priority": "high",
  "createdAt": "2026-10-12T14:30:00Z"
}
'''
Documenta campos obligatorios, formatos, límites, autenticación y comportamiento ante errores.

## 4. Validación y seguridad
Valida en cliente para mejorar experiencia y siempre en servidor para proteger integridad. Usa consultas parametrizadas, codificación de salida, autorización por recurso y protección CSRF cuando el mecanismo de sesión lo requiera. Evita exponer claves privadas en el bundle frontend. Configura CORS con orígenes explícitos; CORS no es un mecanismo de autenticación.

## 5. Estado, errores y observabilidad
En una SPA distingue estado local de interfaz, estado remoto y estado persistente. Gestiona carga, éxito, vacío y error. Registra fallos con identificadores de correlación, sin guardar contraseñas, tokens ni datos personales innecesarios.

## 6. Calidad de código
Usa TypeScript para contratos, componentes pequeños, nombres claros y funciones con responsabilidades acotadas. Añade linting, pruebas unitarias para lógica, pruebas de integración para APIs y pruebas de extremo a extremo para flujos críticos. Revisa accesibilidad con teclado, etiquetas, contraste y lectores de pantalla.

## 7. Flujo Git y CI/CD
Trabaja en ramas, realiza commits pequeños y descriptivos, abre pull requests y revisa diferencias antes de integrar. La integración continua instala dependencias reproducibles, ejecuta análisis, pruebas y build. El despliegue debe poder rastrearse a un commit y permitir rollback.

## 8. Laboratorio
Construye un pequeño gestor de incidencias: listado, creación, filtro por estado y detalle. Define un contrato JSON, valida entradas, simula errores HTTP y añade pruebas. Publica el frontend y documenta variables de entorno sin incluir secretos.

## 9. Reto
La aplicación funciona en local pero falla al desplegar. Elabora un checklist que incluya rutas base, variables de entorno, mayúsculas/minúsculas en nombres de archivos, errores de consola, respuestas de API, CORS, permisos y logs del servidor.',
    color: 'violet',
  },
  {
    id: 'guide-linux-operations',
    type: 'LABORATORIO DE SISTEMAS',
    title: 'Linux para administración: procesos, permisos y servicios',
    category: 'Sistemas operativos',
    level: 'Intermedio',
    time: '40–50 min',
    excerpt: 'Administra archivos, usuarios, permisos, procesos, systemd, almacenamiento y registros con criterio.',
    body: '# Linux para administración de sistemas

## 1. Arquitectura esencial
Linux combina kernel, espacio de usuario, bibliotecas, herramientas y servicios. El kernel administra procesos, memoria, dispositivos y red. Las distribuciones empaquetan estos componentes con gestores de paquetes y ciclos de actualización distintos.

La jerarquía de archivos parte de /. /etc contiene configuración, /var almacena datos variables y logs, /home contiene directorios personales, /tmp guarda temporales y /proc expone información del kernel y procesos.

## 2. Navegación y manipulación segura
'pwd' muestra la ubicación, 'ls -la' lista archivos, 'find' localiza elementos, 'grep' busca texto y 'less' permite leer archivos extensos. Antes de ejecutar una operación recursiva, confirma ruta y alcance. Usa '--help' y 'man' para consultar opciones.

## 3. Usuarios, grupos y permisos
Cada archivo tiene propietario, grupo y permisos para usuario, grupo y otros. Los permisos básicos son lectura (r), escritura (w) y ejecución (x). 'id', 'getent passwd', 'groups' y 'ls -l' ayudan a inspeccionar identidades y permisos.

Evita conceder permisos amplios por comodidad. El bit de ejecución en directorios permite atravesarlos; el permiso de escritura permite crear o eliminar entradas según los permisos del directorio. 'sudo' debe reservarse para tareas justificadas y auditables.

## 4. Procesos y recursos
Un proceso tiene PID, usuario, estado y consumo de recursos. 'ps aux', 'top' o 'htop' permiten observar actividad. 'free -h' resume memoria; 'df -h' muestra espacio de sistemas de archivos y 'du -sh' estima uso de directorios.

No finalices procesos desconocidos sin investigar su función. Identifica servicio, propietario, dependencias y logs antes de intervenir.

## 5. Servicios con systemd
'systemctl status nombre-servicio' consulta estado; 'systemctl is-enabled' revisa habilitación al arranque. 'journalctl -u nombre-servicio' permite revisar eventos del servicio. Distingue un servicio detenido de uno que falla al iniciar por configuración, permisos o dependencias.

## 6. Red y resolución de nombres
'ip addr' muestra interfaces y direcciones; 'ip route' muestra rutas; 'ss -tulpn' resume sockets en escucha; 'resolvectl status' muestra información del resolvedor en sistemas compatibles. Comprueba conectividad IP, ruta y DNS como pruebas separadas.

## 7. Actualización y mantenimiento
Usa repositorios oficiales y el gestor de paquetes de tu distribución. Lee cambios importantes, conserva respaldos de configuración y programa reinicios cuando corresponda. No mezcles repositorios incompatibles sin comprender dependencias.

## 8. Laboratorio seguro
En una máquina virtual propia crea un usuario de práctica, un grupo, un directorio compartido y un archivo de log. Comprueba permisos con dos cuentas distintas. Instala un servicio de prueba desde los repositorios de la distribución, consulta su estado y revisa sus logs. Documenta qué cambia al modificar propietario o permisos.

## 9. Diagnóstico
Un servicio no inicia después de reiniciar. Revisa estado, logs, configuración, permisos, puertos ocupados, dependencias y espacio disponible. Formula hipótesis y cambia una variable a la vez.',
    color: 'green',
  },
  {
    id: 'guide-data-sql',
    type: 'GUÍA DE DATOS',
    title: 'Bases de datos y SQL: diseño, consultas e integridad',
    category: 'Bases de datos',
    level: 'Intermedio',
    time: '45 min',
    excerpt: 'Diseña un modelo relacional, consulta con JOIN, comprende transacciones e índices y evita errores comunes.',
    body: '# Bases de datos relacionales y SQL aplicado

## 1. Modelar antes de consultar
Una base de datos relacional representa entidades mediante tablas. Una fila representa una instancia y una columna un atributo. Define tipos, restricciones y relaciones antes de crear tablas. Evita almacenar listas separadas por comas en una columna cuando representan entidades relacionadas.

## 2. Claves e integridad
La clave primaria identifica de forma única cada fila. Una clave foránea mantiene la relación con otra tabla. NOT NULL, UNIQUE, CHECK y DEFAULT expresan reglas en la propia base de datos. Estas restricciones protegen los datos incluso cuando varias aplicaciones los modifican.

## 3. Modelo de ejemplo
Un sistema de soporte puede incluir usuarios, tickets y comentarios. Cada ticket pertenece a un usuario; cada comentario pertenece a un ticket y a su autor.

'''sql
CREATE TABLE tickets (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  requester_id BIGINT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('open','in_progress','closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
'''

En un proyecto real, requester_id debe referenciar la tabla de usuarios y las reglas de acceso deben implementarse en el servidor o mediante políticas adecuadas de la plataforma.

## 4. Consultas y relaciones
'''sql
SELECT status, COUNT(*) AS total
FROM tickets
GROUP BY status
ORDER BY total DESC;
'''
JOIN combina registros relacionados. INNER JOIN devuelve coincidencias; LEFT JOIN conserva todas las filas de la tabla izquierda aunque no exista relación coincidente. Aprende a filtrar antes de agregar y a interpretar resultados duplicados por relaciones uno-a-muchos.

## 5. Escrituras y transacciones
INSERT crea registros; UPDATE modifica; DELETE elimina. Antes de ejecutar una actualización, prueba el filtro con SELECT. Una transacción agrupa operaciones: COMMIT confirma y ROLLBACK revierte. ACID describe atomicidad, consistencia, aislamiento y durabilidad.

## 6. Índices y rendimiento
Un índice acelera ciertas búsquedas a cambio de espacio y coste en escrituras. Indexa columnas usadas con frecuencia en filtros, joins y ordenamientos, pero valida con EXPLAIN/EXPLAIN ANALYZE y datos representativos. Un índice innecesario puede ralentizar inserciones y actualizaciones.

## 7. Seguridad y operación
Usa parámetros en consultas, roles con mínimo privilegio, copias de seguridad y pruebas periódicas de restauración. No construyas SQL concatenando entradas del usuario. Evita compartir dumps con datos personales reales; utiliza datos sintéticos para prácticas.

## 8. Laboratorio
Crea tablas de departamentos, empleados y tickets. Inserta datos ficticios, consulta con JOIN, agrupa tickets por estado y crea una transacción que actualice dos tablas. Comprueba restricciones y explica qué sucede cuando una clave foránea apunta a un registro inexistente.

## 9. Reto de optimización
Una consulta tarda demasiado. Revisa el plan, cardinalidad, filtros, índices y volumen de datos. No agregues índices a ciegas: identifica primero qué operación consume tiempo.',
    color: 'green',
  },
  {
    id: 'guide-cloud-devops',
    type: 'GUÍA DE PLATAFORMA',
    title: 'Cloud y DevOps: infraestructura, CI/CD y observabilidad',
    category: 'Cloud y DevOps',
    level: 'Intermedio',
    time: '45–55 min',
    excerpt: 'Relaciona redes cloud, cómputo, almacenamiento, automatización, despliegues y operación confiable.',
    body: '# Cloud y DevOps: diseñar y operar servicios

## 1. Modelos de servicio
IaaS ofrece recursos de infraestructura; PaaS abstrae parte de la plataforma; SaaS entrega una aplicación administrada. La nube pública comparte infraestructura bajo controles del proveedor, mientras que nube privada y modelos híbridos responden a requisitos distintos.

La responsabilidad compartida varía según el servicio. El proveedor protege componentes de la plataforma, pero el cliente sigue siendo responsable de identidades, datos, configuración y permisos que administra.

## 2. Componentes de una arquitectura
Una aplicación puede combinar red virtual, subredes, balanceador, cómputo, base de datos, almacenamiento de objetos, DNS y monitoreo. Diseña zonas públicas y privadas, limita exposición y documenta flujos. No publiques bases de datos directamente a Internet por conveniencia.

## 3. Disponibilidad y escalabilidad
Escalar verticalmente aumenta recursos de una instancia; escalar horizontalmente añade instancias. Un balanceador distribuye solicitudes. La alta disponibilidad requiere eliminar puntos únicos de fallo y probar escenarios de pérdida de zona o dependencia.

## 4. Contenedores
Una imagen contiene aplicación y dependencias; un contenedor es una instancia aislada de esa imagen. Los contenedores no reemplazan automáticamente máquinas virtuales ni controles de seguridad. Usa imágenes confiables, versiones fijadas, usuario no privilegiado y escaneo de dependencias.

## 5. Infraestructura como código
IaC describe recursos de forma declarativa y versionable. Permite revisar cambios, repetir entornos y detectar desviaciones. Protege estados, secretos y credenciales; realiza planes antes de aplicar y revisa permisos requeridos.

## 6. Pipeline CI/CD
Un pipeline típico instala dependencias, analiza código, ejecuta pruebas, construye artefactos, publica y despliega. Separa entornos de desarrollo, pruebas y producción. Requiere aprobaciones para cambios sensibles, trazabilidad por commit y estrategia de rollback.

## 7. Observabilidad
Logs describen eventos; métricas cuantifican comportamiento; trazas muestran el recorrido de una solicitud entre servicios. Define indicadores como latencia, tasa de errores y saturación. Una alerta debe corresponder a un impacto o riesgo accionable, no a cada variación menor.

## 8. Costos y gobierno
Etiqueta recursos, define presupuestos, apaga entornos temporales y revisa almacenamiento, transferencia y cómputo. Aplica políticas de región, retención y acceso según necesidades. La nube no es automáticamente más barata: depende del patrón de uso.

## 9. Laboratorio de entrega
En un repositorio de prueba, crea una aplicación sencilla, agrega pruebas y configura un pipeline que compile en cada pull request. Publica primero en un entorno de prueba. Documenta variables, secretos, artefacto generado y procedimiento de reversión.

## 10. Reto
Un despliegue pasa las pruebas pero el servicio no responde en producción. Revisa salud de instancias, reglas de red, DNS, certificado, variables, logs, dependencias y cambios recientes. Decide si corresponde rollback mientras investigas.',
    color: 'blue',
  },
  {
    id: 'guide-hardware',
    type: 'MANUAL DE DIAGNÓSTICO',
    title: 'Hardware y arquitectura de computadoras: diagnóstico sistemático',
    category: 'Hardware y electrónica',
    level: 'Intermedio',
    time: '35–45 min',
    excerpt: 'Relaciona CPU, memoria, almacenamiento, firmware, energía y síntomas para diagnosticar equipos.',
    body: '# Hardware y arquitectura de computadoras

## 1. Cómo se organiza un equipo
La CPU ejecuta instrucciones; la RAM mantiene datos de trabajo; el almacenamiento conserva información; la placa base conecta componentes y buses; la fuente convierte energía para alimentar el sistema. La GPU procesa gráficos y cargas paralelas. Cada componente tiene límites térmicos, eléctricos y de compatibilidad.

## 2. CPU, memoria y rendimiento
La frecuencia no explica por sí sola el rendimiento. Influyen arquitectura, núcleos, caché, memoria, límites térmicos y tipo de tarea. Cuando la RAM se agota, el sistema puede utilizar memoria virtual, con una penalización de rendimiento.

## 3. Almacenamiento
HDD utiliza medios magnéticos; SSD utiliza memoria flash. Revisa salud con herramientas compatibles del fabricante y SMART, pero recuerda que los indicadores no predicen todos los fallos. Mantén respaldos independientes antes de intervenir una unidad sospechosa.

## 4. Firmware y arranque
UEFI inicializa hardware y participa en el proceso de arranque. Secure Boot ayuda a verificar componentes de arranque confiables. Un cambio de modo de almacenamiento, orden de arranque o firmware puede impedir que el sistema inicie; documenta los valores originales antes de modificar ajustes.

## 5. Temperatura y energía
La carga, ventilación, polvo y pasta térmica influyen en temperatura. Observa tendencias y límites especificados por el fabricante. No abras fuentes de alimentación ni manipules componentes energizados. Para prácticas físicas, desconecta el equipo y sigue procedimientos de seguridad y garantía.

## 6. Diagnóstico por síntomas
- No enciende: verifica toma, cable, adaptador, indicador de energía y documentación del fabricante.
- Enciende sin imagen: revisa monitor, entrada, cable y códigos de diagnóstico.
- Reinicios bajo carga: consulta temperaturas, registros, memoria y fuente con herramientas apropiadas.
- Lentitud: revisa uso de CPU/RAM/disco, espacio libre, procesos y estado del almacenamiento.

## 7. Método de intervención
Registra síntoma y contexto, realiza una inspección externa, consulta logs y diagnósticos no invasivos, formula hipótesis y prueba una variable por vez. Antes de sustituir piezas confirma compatibilidad y respalda información importante.

## 8. Laboratorio de inventario
En un equipo propio o una máquina virtual, documenta CPU, RAM, almacenamiento, sistema operativo y versión de firmware disponible. Relaciona cada componente con su función y crea una ficha de mantenimiento preventivo.

## 9. Reto
Un portátil se vuelve lento después de varios minutos de uso. Diseña una secuencia de observación para distinguir saturación de memoria, carga de CPU, temperatura, almacenamiento y procesos en segundo plano sin asumir una causa.',
    color: 'green',
  },
  {
    id: 'guide-it-support',
    type: 'PLAYBOOK OPERATIVO',
    title: 'Soporte técnico profesional: gestión de incidencias y SLA',
    category: 'Soporte técnico',
    level: 'Intermedio',
    time: '35–45 min',
    excerpt: 'Aplica triage, priorización, documentación, escalamiento y comunicación centrada en el usuario.',
    body: '# Soporte técnico profesional: del ticket a la mejora

## 1. El soporte como proceso
El objetivo no es solamente cerrar tickets: es restaurar el servicio, reducir impacto y evitar recurrencias. Distingue incidente (interrupción o degradación), solicitud de servicio (petición estándar), problema (causa subyacente) y cambio (modificación controlada).

## 2. Registro de calidad
Un ticket útil incluye usuario o área, activo afectado, ubicación, hora, síntoma, alcance, impacto, urgencia, mensaje exacto, cambios recientes y evidencias permitidas. Evita registrar contraseñas o información sensible innecesaria.

## 3. Prioridad y SLA
La prioridad suele combinar impacto y urgencia. Un fallo que afecta a toda una sede puede tener prioridad mayor que una solicitud individual sin bloqueo. El SLA define compromisos de respuesta o resolución; confirma las reglas reales de la organización y no prometas tiempos que no controlas.

## 4. Diagnóstico estructurado
1. Escucha y confirma el síntoma sin asumir la causa.
2. Reproduce o valida el problema con permiso.
3. Determina alcance y servicios dependientes.
4. Consulta cambios recientes, alertas y base de conocimiento.
5. Formula hipótesis y realiza pruebas de bajo riesgo.
6. Escala con evidencias cuando exceda permisos o especialidad.
7. Valida la solución con el usuario y documenta prevención.

## 5. Comunicación
Explica qué se sabe, qué se está investigando y cuándo habrá una actualización. Evita tecnicismos innecesarios y no culpes al usuario. Si no hay solución inmediata, ofrece una alternativa aprobada y comunica limitaciones.

## 6. Escalamiento efectivo
Incluye resumen, impacto, equipos afectados, pasos realizados, resultados, hora, logs relevantes y cambios recientes. No escales únicamente diciendo “no funciona”; transfiere contexto suficiente para continuar sin repetir pruebas.

## 7. Gestión del conocimiento
Convierte soluciones recurrentes en artículos con síntoma, entorno, causa, resolución, validación y fecha de revisión. Añade condiciones donde la solución no aplica. La documentación debe actualizarse cuando cambia el software o el procedimiento.

## 8. Métricas útiles
Tiempo de primera respuesta, tiempo de resolución, resolución en primer contacto, reaperturas, satisfacción y volumen por categoría. Interpreta las métricas en conjunto: cerrar rápido no es éxito si el incidente vuelve a abrirse.

## 9. Simulación
Un departamento reporta que no puede imprimir. Registra el caso, delimita si afecta a una impresora o a todas, verifica conectividad y cola, consulta mensajes y cambios recientes. Redacta un ticket y una actualización para el usuario.

## 10. Reto
Un usuario solicita acceso administrativo para instalar una aplicación. Describe cómo validar la necesidad, revisar política, buscar una alternativa aprobada y escalar sin compartir credenciales ni saltarse controles.',
    color: 'blue',
  },
  {
    id: 'guide-ai-literacy',
    type: 'ANÁLISIS TECNOLÓGICO',
    title: 'Inteligencia artificial aplicada: modelos, evaluación y límites',
    category: 'Inteligencia artificial',
    level: 'Intermedio',
    time: '40–50 min',
    excerpt: 'Diferencia aprendizaje automático, redes neuronales y modelos generativos; evalúa calidad, sesgos y privacidad.',
    body: '# Inteligencia artificial aplicada: comprender antes de implementar

## 1. IA, machine learning y deep learning
Inteligencia artificial es el campo amplio de sistemas que realizan tareas asociadas con percepción, razonamiento o generación. Machine learning aprende patrones a partir de datos. Deep learning utiliza redes neuronales con múltiples capas para representar relaciones complejas.

## 2. Entrenamiento e inferencia
Durante entrenamiento, el modelo ajusta parámetros para reducir una función de pérdida sobre datos. En inferencia, utiliza parámetros aprendidos para producir una salida ante nuevas entradas. Separar entrenamiento, validación y prueba ayuda a medir generalización y detectar sobreajuste.

## 3. Modelos generativos
Los modelos de lenguaje predicen secuencias de tokens a partir del contexto. Pueden generar respuestas fluidas que no necesariamente son verdaderas. La recuperación de documentos (RAG) puede aportar contexto verificable, pero no elimina errores de interpretación ni reemplaza controles de acceso.

## 4. Cómo evaluar
Define la tarea y una métrica antes de elegir modelo. Evalúa exactitud, cobertura, latencia, coste, robustez y comportamiento ante entradas fuera de distribución. Usa un conjunto de evaluación representativo y revisión humana en decisiones de alto impacto.

## 5. Sesgos y privacidad
Los datos pueden reflejar sesgos históricos o representar mal ciertos grupos. Minimiza datos personales, define retención, revisa permisos y no introduzcas información confidencial en servicios sin autorización. Comprueba licencias y procedencia de datasets.

## 6. Ingeniería de prompts
Un prompt claro especifica objetivo, contexto, formato, restricciones y criterios de calidad. Divide tareas complejas, aporta ejemplos relevantes y pide que se indiquen incertidumbres. Verifica datos externos con fuentes primarias.

## 7. Integración responsable
Define qué puede hacer el modelo, qué acciones requieren aprobación humana, cómo se registran errores y cómo detener el sistema. Protege herramientas y conectores con mínimo privilegio; el texto generado no debe convertirse automáticamente en una instrucción confiable.

## 8. Laboratorio de evaluación
Crea un conjunto de diez preguntas técnicas con respuestas verificadas. Compara respuestas de un modelo con la documentación oficial, registra errores, clasifica alucinaciones y mide consistencia. No utilices datos personales reales.

## 9. Reto
Una IA propone una configuración de red incorrecta con mucha seguridad. Diseña una verificación basada en documentación del fabricante, simulación controlada y revisión humana antes de aplicar cambios.',
    color: 'violet',
  },
  {
    id: 'guide-certification-roadmap',
    type: 'PLAN DE ESTUDIO',
    title: 'Ruta profesional IT: competencias, laboratorios y portafolio',
    category: 'Certificaciones y formación',
    level: 'Todos los niveles',
    time: '30–40 min',
    excerpt: 'Convierte el estudio en evidencias: objetivos, prácticas, documentación y preparación para certificaciones.',
    body: '# Ruta profesional IT: aprender, practicar y demostrar

## 1. Competencias antes que insignias
Una certificación puede ordenar el aprendizaje y validar conocimientos, pero no sustituye la práctica. Define un rol objetivo —soporte, redes, sistemas, cloud o seguridad— y construye competencias observables para ese puesto.

## 2. Fundamentos transversales
Refuerza sistemas operativos, redes, conceptos de seguridad, documentación técnica, resolución de problemas y comunicación. Aprende a explicar qué hiciste, por qué lo hiciste y cómo comprobaste el resultado.

## 3. Estudio por objetivos
Convierte cada tema en resultados medibles. En redes, por ejemplo: calcular subredes, configurar VLAN, interpretar una tabla de rutas y aislar una falla DNS. Alterna lectura, práctica espaciada, recuperación activa y explicación con tus propias palabras.

## 4. Laboratorios progresivos
Empieza con una topología pequeña y añade complejidad gradualmente. Guarda archivos, diagramas, configuraciones sin secretos y capturas relevantes. Registra objetivo, entorno, pasos, resultado esperado, resultado real y reflexión.

## 5. Portafolio técnico
Un proyecto sólido contiene problema, alcance, diagrama, decisiones, configuración anonimizada, pruebas, incidencias encontradas y mejoras futuras. No publiques direcciones, credenciales, datos de clientes ni información de redes reales.

## 6. Preparación para exámenes
Consulta el blueprint oficial vigente, identifica dominios, practica preguntas de razonamiento y revisa cada error. No dependas de bancos filtrados. Verifica versión, requisitos, precio y política del examen en el sitio oficial del emisor.

## 7. Evidencia de competencia
Puedes demostrar habilidades mediante un laboratorio documentado, una guía propia, un repositorio ordenado, una explicación técnica o una práctica reproducible. La calidad de la evidencia importa más que acumular proyectos sin terminar.

## 8. Plan de 4 semanas
Semana 1: diagnóstico de conocimientos y fundamentos. Semana 2: laboratorio guiado. Semana 3: resolver fallos y documentar. Semana 4: presentar el proyecto, recibir revisión y definir siguiente objetivo. Ajusta el ritmo a tu disponibilidad.

## 9. Reto
Elige una competencia de una vacante real. Diseña una práctica que produzca evidencia verificable y explica qué conocimientos previos necesitas, cómo medirás el resultado y qué limitaciones tiene tu laboratorio.`,
    color: 'violet',
  },
]
