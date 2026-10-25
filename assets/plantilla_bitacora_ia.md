# 📜 Bitácora de Uso de IA en el Colegio Mágico (Entrega en PR)

> **Instrucciones:** Copia todo este contenido y pégalo en la descripción de tu Pull Request (PR).  
> **Recordatorio:** Este informe vale el **20% de tu calificación final** y debe ser redactado con tus propias palabras (sin utilizar IA para generar el texto del reporte).

---

## 🧙‍♂️ Datos del Aprendiz
* **Nombre del Estudiante:** [JUAN CAMILO GIRADO GOMEZ]
* **Usuario de GitHub:** [@gjuanccamilo]
* **Herramientas de IA utilizadas:** [Gemini 3.8 flash y antigravity]

---

## 🔍 Bitácora del Reto 5: El Transmutador de Estados (Filtros y Estabilidad)

### 1. Prompt Principal Formulado
> *Pega aquí el prompt exacto que le diste a la IA:*
```text
["Actúa como un arquitecto senior de Angular y experto en TypeScript. Necesito implementar un motor de búsqueda multi-criterio (getPocionesFiltradas) que filtre un arreglo de objetos tipo Pocion combinando una cadena de texto (insensible a mayúsculas para nombre o descripción), un selector de categoría (filtroTipoMagia), un booleano para filtrar elementos de alto peligro (filtroSoloPeligrosas > 7), y aplique un ordenamiento dinámico ascendente/descendente basado en el nivel de peligro. Adicionalmente, requiero una función reactiva (calcularEstabilidadCaldero) que evalúe las métricas del arreglo y devuelva estrictamente los estados 'CRÍTICO', 'INESTABLE' o 'SEGURO' basándose en la densidad de pociones peligrosas."]
```

### 2. ¿Qué respuesta te entregó la IA?
*Describe brevemente la solución que te propuso:*
- [primero me recomendo crar un filtrado getPosicionesFiltradas que recorriera el arreglo verificando la busqueda sin importar que fuera mayuscula o minuscula tanto para nombre como descripción, también que evaluara el tipo de magia y el filtro de peligro cuando el checkbox esté activo, aplicando al final un .sort() para ordenar las pociones según su nivel de peligro de forma ascendente o descendente.]

### 3. Ajustes y Correcciones Manuales
*¿La solución funcionó a la primera? ¿Qué tuviste que corregir o adaptar para que pasaran las pruebas del Tribunal?*
- [Funciono a la primera, solo revise por medio del npm test que estuviera correcto el punto 5]

---

## ⏳ Bitácora del Reto 6: El Giratiempo (Undo / Redo Inmutable)

### 1. Prompt Principal Formulado
> *Pega aquí el prompt exacto que le diste a la IA:*
```text
[Actúa como un arquitecto senior de Angular y experto en TypeScript. Necesito implementar el sistema de historial con funcionalidad de Undo/Redo inmutable (llamado 'El Giratiempo') para un componente de caldero de pociones en CalderoComponent. ¿Cómo debo estructurar los métodos para guardar el estado con clonación profunda, validar las acciones de deshacer/rehacer y restaurar los snapshots correctamente?]
```

### 2. ¿Cómo abordó la IA la inmutabilidad de los objetos?
*Explica qué método te sugirió para clonar el arreglo de pociones sin mutar las referencias originales (ej. map con spread operator, structuredClone, etc.):*
- [Sugirió utilizar una clonación profunda mediante JSON.parse(JSON.stringify(this.pociones)) cada vez que se guarda un estado en el historial (guardarEstadoGiratiempo())]

### 3. Depuración de Errores con la IA
*Si una prueba de Jasmine falló, ¿cómo usaste la IA para encontrar el bug?*
- [No hubieron fallos, igual mire con el localhost que funcionara bien y con el npm test y todo esta correctamente]

---

## 🎨 Resumen del Reto Creativo (Reto 7 - 30%)
* **Nombre de tu Artefacto Mágico:** El Club de Duelo de Hogwarts & Forja Alquímica de Hechizos

* **¿Qué hace tu artefacto y cómo interactúa el usuario?**
  - [Implementé un sistema de combate por turnos donde los usuarios pueden enfrentarse a personajes icónicos como Draco Malfoy, Bellatrix Lestrange y Lord Voldemort. Al comenzar, se elige la Casa de Hogwarts para activar bonificaciones pasivas (como daño crítico en Gryffindor o regeneración de maná en Ravenclaw), además de personalizar el nombre del mago y su varita.
  Durante los duelos, el combate gira en torno a tres acciones principales: Ataque, Defensa con absorción de impacto y Sanación. el proyecto incluye un selector de escenarios entre el Gran Salón y la Arena de Sombras, un Salón de Honor para consultar las estadísticas de victoria, y un taller alquímico interactivo que permite crear hechizos personalizados y añadirlos directamente al grimorio de combate]

* **¿Qué hooks de ciclo de vida implementaste?**
  - `ngOnInit`: Carga del grimorio inicial, configuración de la arena e inicio del intervalo de regeneración ambiental de maná.
  - `ngAfterViewInit`: Inicialización y verificación post-renderizado de los componentes visuales del artefacto.
  - `ngOnDestroy`: Destrucción y limpieza defensiva de intervalos y temporizadores (`clearInterval` y `clearTimeout`) para evitar fugas de memoria y procesos fantasma en segundo plano.

* **¿Qué directivas y enlaces utilizaste?**
  - Control de flujo con directivas (@if y @for): Usé estas directivas para cambiar las pantallas del juego según la fase del duelo: preparación, combate, victoria o derrota. También mostré alertas cuando la salud del mago bajaba del 25 %. Además, mostré de manera dinámica el catálogo de hechizos con su pista, las Casas de Hogwarts, los rivales y el historial de turnos, incluso cuando las listas están vacías

Enlace de datos ([(ngModel)]): Utilicé este enlace en los formularios de personalización, como el nombre del mago, la Casa y la varita elegidas, y el rival seleccionado. También lo usé en los campos del taller de forja para crear nuevos hechizos: nombre, tipo, poder, costo de maná y descripción

Estilos dinámicos y eventos: Ajusté las barras de vida y maná con anchos reactivos usando [style.width.%]. Añadí clases dinámicas con [ngClass] para distinguir tipos de hechizos y Casas. Usé [disabled] para bloquear botones cuando falta maná. También capturé las acciones del usuario con eventos de clic y cambio

---

## 💡 Reflexión Crítica del Aprendiz
*¿En qué momentos sentiste que la IA te ahorró tiempo y en qué momentos una mala respuesta te retrasó?*
- [Senti que me ayudo mucho cuando empece a hacer el punto 7 porque no sabia ni por donde empezar para plasmar la idea que tenia para el reto, pero diciendole a la ia que queria como lo queria corrigiendo lo que no me gustaba me lo dejo como queria y no me demore tanto tiempo haciendo esto como 15 minutos, el tiempo que me ahorre fue demaciado ya que sin esta quien sabe cuando hubieraa terminado y si hubiera quedado como lo imagine.
senti que me empezo a retrazar cuando le pedi que hiciera que el usuario pudiera elegir entre 3 magos  competir y que pudiera ir como derrotando los 3,solo me ponia uno no me dejaba elegir el otro o cuando derrotabas uno no pasaba al otro pero solo le pedi que revizara de nuevo el pront que le di y le expecifique que queria que se pudiera elegir contra quien seria el duelo, y cuando derrotaras a un mago pasara al otro y cuando derrotara todos mostrara una pantalla de victoria y con eso lo implemento tal y como queria]