# Cajas de la Fe 2026 — Landing page estática

Sitio web para la campaña de apadrinamiento de Iglesia Pacto y Bendición, comunidad Villa Belén. Está listo para alojarse en **GitHub Pages**, sin base de datos, sin panel de administración y sin dependencias de compilación.

## Contenido

- `index.html`: portada, lista de 10 perfiles, explicación del proyecto, guía de regalos, preguntas frecuentes, fechas y botón de WhatsApp.
- `styles.css`: diseño responsive con la línea gráfica del material de referencia (fucsia, turquesa, amarillo, blanco y púrpura).
- `app.js`: perfiles, búsqueda y mensajes prellenados para WhatsApp.
- `config.js`: número de coordinación y URL de hoja pública opcional para estados.
- `assets/`: fotografías y logotipo original exportados de la presentación.
- `estados-ejemplo.csv`: ejemplo opcional para mantener el estado de los apadrinamientos.

## Subir a GitHub Pages

1. Entra a tu repositorio `matrixoti12/Cajas-De-la-Fe`.
2. Sube **el contenido de esta carpeta directamente a la raíz del repositorio**, no una carpeta contenedora. Debes ver `index.html` en la raíz.
3. En **Settings → Pages → Build and deployment**, selecciona **Deploy from a branch**; elige `main` y `/ (root)`, y guarda los cambios.
4. El sitio podrá abrirse en `https://matrixoti12.github.io/Cajas-De-la-Fe/` si el repositorio conserva ese nombre y GitHub Pages está activado.

No se requiere `npm`, Node.js ni hosting con servidor.

## ¿Qué ocurre cuando alguien quiere apadrinar?

Un botón abre `https://wa.me/50377985997` con un mensaje que incluye el nombre del niño, su edad, sus gustos y sus tallas. **Ese clic NO reserva al niño.** El equipo de la iglesia consulta la disponibilidad y confirma por WhatsApp. No hay formulario ni opción de regalo extra.

## Estados sin base de datos (OPCIONAL)

**Opción simple:** deja `estadosCsvUrl: ''` en `config.js`. Todas las fichas indican *Consultar disponibilidad*, y el equipo confirma por WhatsApp. No tienes que actualizar nada.

**Opción con etiquetas visibles actualizadas desde el celular (sin base de datos):**

1. Crea una hoja de cálculo de Google Sheets con columnas `id` y `estado`, siguiendo el archivo `estados-ejemplo.csv`.
2. Modifica las filas al confirmar cada niño por WhatsApp. Estados reconocidos: `disponible`, `en_consulta`, `apadrinado`, `consultar`.
3. En Google Sheets usa **Archivo → Compartir → Publicar en la Web**, selecciona la pestaña como CSV y copia la URL pública HTTPS.
4. Pega esa URL en `config.js`, por ejemplo `estadosCsvUrl: 'https://docs.google.com/spreadsheets/d/e/.../pub?output=csv'`, y publícala una sola vez con el sitio.
5. En adelante solo cambias las filas de la hoja desde tu teléfono. Al abrir la web, los visitantes ven las etiquetas actualizadas. Nunca incluyas teléfonos, nombres de padrinos, datos privados ni datos adicionales de niños en la hoja pública; solo `id` y `estado`.

> Una hoja publicada puede tardar en reflejar modificaciones. Si el CSV no carga por conexión o permisos, la web vuelve a “Consultar disponibilidad”. Siempre confirma por WhatsApp antes de aceptar el regalo. Esta opción no reserva ni bloquea solicitudes.

## Guía de regalos para padrinos

- Un juguete principal interactivo o educativo.
- Una prenda nueva, tomando en cuenta la talla.
- Un accesorio escolar.
- Una carta escrita a mano con buenos deseos para 2027.
- Presupuesto **sugerido**: USD 15–20 para mantener regalos semejantes.
- Presentación en caja de cartón forrada con papel navideño, con el nombre completo del niño.
- Fecha límite de entrega a coordinación: **6 de diciembre de 2026**.
- Fiesta de entrega a los niños: **19 de diciembre de 2026**.

## Datos pendientes

- La talla de zapatos de Melani está **por confirmar**.
- La talla `5` de zapatos de Darlin requiere aclarar el sistema de tallaje.
- Verificar las fichas de todos los niños antes de compartir el enlace públicamente.

## Protección de menores

El sitio contiene imágenes y nombres completos de niños y niñas. **Asegura el consentimiento de sus responsables legales** antes de publicarlo. El HTML incluye `noindex, nofollow` como precaución para evitar su indexación en buscadores, pero eso **no impide el acceso** a quienes tengan el enlace ni convierte el repositorio en privado. Si se requiere privacidad real, no publiques los datos personales en un repositorio público.
