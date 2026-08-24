# SIRA — Sistema Integrado de Revisión de Archivos

*E.S.E. Hospital San Rafael de Chinú*

Aplicación web que valida y corrige el archivo de **Seguimiento Materno (SMH)**
según el *Instructivo SMH V5*, antes de subirlo al sistema de salud.

Cargas el CSV, la app lo revisa campo por campo, corrige todo lo que se puede
corregir sin inventar datos, y te entrega el archivo listo con el nombre que
exige la plataforma.

## Cómo se usa

El flujo va guiado en un asistente de tres pasos:

1. **Cargar archivo.** Arrastras el CSV o lo buscas en el computador.
2. **Validar y corregir.** Muestra el avance mientras lee, reconoce las 248
   columnas, valida contra el instructivo y aplica las correcciones.
3. **Descargar.** Se propone el nombre `NIT_AÑO_MES_Snn` a partir de los datos y
   puedes editar cualquier parte ahí mismo. Si la semana no coincide con la que
   corresponde a la fecha de corte según el calendario epidemiológico del INS,
   la app te la sugiere con un clic. La descarga se bloquea si el nombre no
   cumple el formato.

Al cerrar el asistente queda en pantalla el detalle completo: métricas, la lista
de campos por completar y el reporte de todas las correcciones aplicadas. Ambas
tablas van paginadas (10, 30 o 50 filas), porque un archivo grande puede dejar
decenas de miles de registros y volcarlos todos de golpe bloquea el navegador.

Cada campo por completar viene marcado con lo que le ocurre:

| Marca | Qué significa |
|---|---|
| **Falta el dato** | El campo es obligatorio y viene vacío |
| **No concuerda** | El dato existe pero se contradice con otro del mismo registro |
| **No se entiende** | El valor no se pudo interpretar (por ejemplo, letras donde va una fecha) |

El logo se puede cambiar por el oficial: ver [src/ui/LEEME-logo.md](src/ui/LEEME-logo.md).

## El archivo nunca sale de tu computador

Todo el procesamiento ocurre dentro de la pestaña del navegador. No hay backend,
no hay base de datos y no se envía nada a ningún servidor. Los datos de las
gestantes (nombres, documentos, diagnósticos) no viajan por la red.

Por eso la carpeta `datos-prueba/` está excluida en `.gitignore`: contiene un
archivo real y **no debe subirse a GitHub ni a Vercel**.

## Resultado sobre el caso real

El archivo `8000193912_2026_07_S32.csv` fue rechazado con **909 errores**.
Tras pasarlo por el corrector:

| | |
|---|---|
| Errores resueltos automáticamente | **909 de 909 (100 %)** |
| Correcciones aplicadas | 548 |
| Requieren que tú completes el dato | 0 |

### Numeración de las filas

La columna «Fila» de los reportes cuenta el encabezado como fila 1, igual que
Excel y que el identificador del reporte de errores de la plataforma. Así el
número lleva directamente a la gestante correcta al abrir el archivo.

---

## Cómo ejecutarlo en tu computador

Necesitas [Node.js](https://nodejs.org) instalado.

```bash
npm run dev
```

Abre <http://localhost:3000>.

Para correr las pruebas:

```bash
npm test
```

Son dos suites: `tests/validar.mjs` comprueba el resultado contra el archivo
real que la plataforma rechazó, y `tests/cobertura.mjs` genera registros
sintéticos que llenan las 248 columnas con datos desordenados y verifica que
todas salgan conformes al instructivo.

---

## Cómo publicarlo en GitHub Pages

No hay backend ni base de datos, así que basta con servir los archivos tal cual.

**1. Confirma que los datos de gestantes quedan fuera**

```bash
git status --short
```

No debe aparecer nada de `datos-prueba/` ni ningún `.csv`.

**2. Sube el proyecto**

```bash
git remote add origin https://github.com/yisus1624/Hospital.git
git push -u origin main
```

**3. Activa Pages**

En GitHub: **Settings → Pages → Source: Deploy from a branch**, rama `main`,
carpeta `/ (root)`. En un par de minutos queda en
`https://yisus1624.github.io/Hospital/`. Cada `git push` a `main` actualiza el
sitio.

> Pages con repositorio **privado** requiere cuenta GitHub Pro. Con cuenta
> gratuita hay que pasar el repositorio a público: el código no contiene datos
> de pacientes, así que no hay riesgo en hacerlo.

**No sirve abrir `index.html` con doble clic.** La aplicación usa módulos de
JavaScript y el navegador los bloquea con `file://`. Tiene que abrirse desde
Pages o desde `npm run dev`.

---

## Qué corrige automáticamente

Solo se corrige lo que queda determinado por el instructivo o por otro campo del
mismo registro:

| Tipo | Ejemplo |
|---|---|
| Espacios sobrantes | `"NO "` → `NO` — era la causa de casi la mitad de los errores |
| Formato de fecha | `15/03/2026`, `20260315`, serial de Excel → `2026-03-15` |
| Valores de catálogo | `Positivo`, `pos`, `+` → `POSITIVO` |
| Vocabulario equivocado | `ALTO`/`BAJO` donde el sistema pide `SI`/`NO` o los códigos `4`/`5` |
| Tildes | `PÉREZ` → `PEREZ`. **La ñ se conserva**: `CAÑAS` sigue siendo `CAÑAS`, porque `CANAS` es otro apellido |
| Campos que no aplican | Si `ecografia3` es `NO`, sus campos hijos se vacían |
| Centinelas obligatorios | Chagas sin tamizaje → fecha `1845-01-01` |
| Códigos de "no aplica" | Sin sífilis confirmada → tratamiento `4`, pareja `3` |
| Causa de muerte | Si la madre no falleció → `4` |
| Tipo de caso vacío | → `21`, lo que libera los nueve campos de seguimiento |
| Grávida | Recalculada: partos + cesáreas + abortos + ectópicos + 1 |
| FPP incoherente | Recalculada como FUM + 280 días (regla de Naegele) |
| Nombre del archivo | `NIT_AÑO_MES_Snn` con NIT de 9 dígitos |
| FUM imposible | Si implica más de 42 semanas de gestación, se reconstruye desde la semana gestacional registrada |
| Pruebas en el trimestre equivocado | Una prueba de VIH tomada en la semana 18 pero reportada como de trimestre 1 se traslada al trimestre 2 |
| Controles duplicados | Dos controles del mismo profesional con idéntica fecha: se elimina la copia |

## Qué NO corrige, y por qué

Un dato clínico ausente no se puede deducir. Rellenarlo produciría un archivo
que el sistema acepta pero que reporta información falsa sobre una paciente.
Esos casos se listan en la pestaña **Revisión manual**:

- Documentos, diagnósticos CIE-10 o resultados de laboratorio en blanco.
- Resultados que se contradicen con el tipo de estudio declarado.

La FUM es el único dato clínico que se reconstruye, y solo cuando la registrada
es **imposible** (implicaría un embarazo de más de 42 semanas). En ese caso se
deriva de la semana gestacional del propio archivo y el cambio queda anotado en
el reporte de correcciones para cotejarlo con la historia clínica.

### Dos supuestos que sí se aplican

Para que el sistema no rechace filas completas, el corrector asume dos cosas
cuando el archivo no las trae:

- Las preguntas obligatorias de SI/NO que quedan en blanco se registran como
  `NO`, es decir, "sin registro afirmativo".
- Si hay fecha de un control pero no se indicó la modalidad, se registra
  `PRESENCIAL`.

Ambos casos aparecen uno por uno en el reporte de correcciones, con su motivo.

---

## Estructura del proyecto

```
sira/
├── index.html                 Página principal
├── package.json
├── vercel.json                Cabeceras de seguridad para el despliegue
│
├── src/
│   ├── core/                  Motor de validación (sin dependencias del navegador)
│   │   ├── esquema.js         Los 248 campos: tipo, longitud, catálogo, reglas
│   │   ├── texto.js           Limpieza de espacios, tildes y forma canónica
│   │   ├── fechas.js          Interpretación y aritmética de fechas
│   │   ├── epidemiologia.js   Semana epidemiológica (estándar MMWR del INS)
│   │   ├── catalogos.js       Sinónimos y equivalencias por campo
│   │   ├── normalizar.js      Normalización de una celda según su tipo
│   │   ├── reglas.js          Coherencia entre campos y centinelas
│   │   ├── corrector.js       Orquestador
│   │   └── archivo.js         Lectura/escritura de CSV y nombre de salida
│   │
│   └── ui/
│       ├── app.js             Asistente, tablas y descargas
│       ├── estilos.css
│       ├── logo-hospital.svg  Emblema institucional
│       └── LEEME-logo.md      Cómo usar el logo oficial
│
├── tests/
│   └── validar.mjs            Prueba de regresión contra el caso real
│
├── datos-prueba/              (excluida de git — contiene datos reales)
└── docs/
    ├── Instructivo_SMH_V5.pdf Fuente normativa
    ├── schema.py              Script que generó esquema.js desde el instructivo
    └── columnas.py            Nombres oficiales de las 248 columnas
```

El motor (`src/core/`) no depende del navegador: es el mismo código que corre en
la app y en las pruebas con Node.

---

## Si la plataforma rechaza el archivo

**1. Sube el reporte de errores.** Hay dos formas de entrar, y da igual cuál uses:

- **Desde la pantalla de inicio**, con el botón «Empezar por el reporte de
  errores». Subes el CSV de errores, SIRA te pide enseguida el archivo SMH que te
  rechazaron y al terminar de corregirlo te deja directamente en el cruce.
- **Desde el bloque «¿La plataforma rechazó el archivo?»** que aparece al final,
  si ya venías corrigiendo un archivo.

El reporte por sí solo no alcanza: solo trae fila, campo y mensaje, no los datos
de la gestante. Por eso siempre hacen falta los dos archivos; lo que no importa
es el orden en que los entregues.

El cruce agrupa los errores por tipo y marca cuáles ya están resueltos y cuáles
siguen abiertos, con el número de fila de cada uno.

Si en ese reporte aparece un error de tipo «debe contener solo letras» sobre una
celda que hoy lleva ñ, es la prueba de que la plataforma no la acepta: SIRA lo
avisa y ofrece un botón para reemplazar la ñ por N en todo el archivo y volver a
descargarlo. Hasta que el sistema no lo demuestre, la ñ se respeta.

Sobre el caso real: de los 909 errores que devolvió la plataforma, el cruce
muestra 908 resueltos y 1 abierto, con el mensaje textual del sistema.

**2. Corrige en Excel y vuelve a subir.** Es el camino natural y funciona:

- Abre el archivo corregido en Excel y edita lo que haga falta.
- Guarda (Excel escribirá las fechas como `31/07/2026`, no importa).
- Vuelve a pasarlo por SIRA: las fechas se restauran a `2026-07-31`.

Está comprobado en las pruebas: un archivo corregido, editado y guardado en
Excel, al volver a pasarlo por SIRA queda **idéntico** al original corregido.

## Corregir un campo suelto sin salir de SIRA

No hace falta abrir el archivo en Excel (que estropearía las fechas) ni editarlo
en el Bloc de notas. Hay dos formas de corregir dentro de SIRA:

**1. Desde la tabla de campos por completar.** Cada fila trae una casilla
editable: escribes el valor correcto, sales del campo y esa fila se vuelve a
revisar al instante. Si el valor sigue sin cumplir el instructivo, te lo dice
(por ejemplo, «300 supera el máximo permitido (200)»).

**2. Con el buscador, para cualquier campo.** Debajo de las tablas está
«Corregir un campo que reportó la plataforma». El reporte de errores del sistema
trae el número de fila y el nombre del campo: los escribes ahí, ves el valor
actual junto con las reglas que aplica el instructivo, lo corriges y listo.

Los números de fila coinciden: el que reporta la plataforma, el que ves en SIRA
y el que muestra Excel son el mismo.

Después de editar, vuelve a descargar el archivo. Los cambios ya van incluidos y
el reporte de correcciones se actualiza solo.

## No abras el archivo corregido en Excel para guardarlo

El archivo lleva las fechas como `2026-07-31`, que es el formato del
instructivo. Si lo abres en Excel las verás como `31/07/2026`: eso es solo la
forma en que Excel muestra las fechas según la configuración regional, y el
archivo está intacto.

El problema aparece si **guardas** desde Excel: entonces sí reescribe las fechas
en ese formato y el sistema rechaza el archivo completo.

- Súbelo tal como se descarga.
- Si quieres revisar el contenido real, ábrelo con el **Bloc de notas**.

## Nota sobre el archivo de entrada

El sistema trabaja con **CSV**, no con Excel. Si tienes un `.xlsx`, ábrelo y usa
**Archivo → Guardar como → CSV UTF-8 (delimitado por comas)**.

El archivo debe traer las 248 columnas del instructivo. Si los encabezados no
coinciden con los nombres oficiales pero hay 248 columnas, la app las empareja
por posición y te avisa.

El separador se detecta solo: funciona con archivos separados por comas, por
punto y coma (lo que produce Excel en configuración regional española) o por
tabuladores, con o sin BOM y con cualquier tipo de salto de línea.

### Discrepancias del instructivo

Al contrastar el documento con lo que el validador acepta en la práctica
aparecieron dos contradicciones, resueltas a favor de lo que el sistema admite:

- **Longitudes.** El instructivo declara longitud 2 para `riesgo`, que admite
  `ALTO`; para los urocultivos, que admiten `INDETECTABLE`; y para `hb`, que
  admite decimales. En esos 14 campos manda el catálogo o el rango.
- **Separador decimal del peso.** El instructivo pide coma, pero el archivo es
  un CSV separado por comas y la plataforma aceptó el punto sin observaciones.
- **Semana epidemiológica.** El instructivo la limita a 52, pero el calendario
  del INS tiene años de 53 semanas. Un valor de 53 se reporta para revisión.
