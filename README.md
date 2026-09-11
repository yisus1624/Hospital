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
Tras pasarlo por el corrector (`npm test` reproduce estas cifras):

| | |
|---|---|
| Correcciones aplicadas | 414 |
| Campos que necesitan que los completes tú | 76, en 18 filas |
| Errores del reporte que quedan resueltos | 650 |
| Errores que siguen abiertos | 88 |
| Errores que dependen de un campo por decidir | 171 |

Los 171 «dependientes» no están resueltos ni abiertos: son errores sobre campos
cuya causa es otro campo que todavía está pendiente. El caso típico son los
nueve campos de seguimiento, que solo hay que diligenciar si el **tipo de caso**
va entre 1 y 12, y el tipo de caso es justamente uno de los datos que tienes que
decidir tú. Hasta que lo hagas no se puede afirmar que esos errores estén
resueltos.

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

Son tres suites, y comprueban cosas distintas:

| Suite | Qué comprueba |
|---|---|
| `tests/instructivo.mjs` | Que el esquema **dice lo mismo que el Instructivo V5**: los 248 tipos, longitudes, catálogos, obligatoriedades, condiciones y reglas de fecha, contrastados contra la tabla del PDF |
| `tests/validar.mjs` | Que sobre un archivo real no se altera ningún dato y lo que exige decisión humana queda señalado |
| `tests/cobertura.mjs` | Que las 248 columnas, llenadas con datos desordenados, salen conformes |

La primera es la que responde a «¿el validador aplica el instructivo?». Corre
contra `docs/instructivo-v5.json`, que es la tabla del PDF extraída tal cual, y
**hay que volver a correrla cada vez que se toque `esquema.js`**.

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
| Nombre del archivo | `NIT_AÑO_MES_Snn` con NIT de 9 dígitos |
| Resultado de sífilis | `POSITIVO` pasa a `REACTIVO` si el estudio declarado es VDRL: es el mismo resultado con la palabra que usa el instructivo |

### Cuando un valor no se puede interpretar

Si una celda trae algo que el sistema no admite y que no se puede traducir sin
adivinar (`ALTO` donde solo van `SI`/`NO`, una fecha que no es una fecha, un
`2,5` en un campo de enteros), **la celda sale vacía en el archivo descargado**.
No hay alternativa: si va el valor original, la plataforma rechaza la fila
entera.

El dato no se pierde. Cada una de esas celdas aparece en los dos reportes:

- en **campos por completar**, con el valor original y el motivo, para que lo
  corrijas ahí mismo;
- en el **reporte de correcciones**, marcada como celda vaciada, para que quede
  constancia de que el archivo descargado ya no lleva ese dato.

Arriba, junto a las métricas, sale un contador de «celdas vaciadas». Si no es
cero, conviene resolver esos campos antes de subir el archivo.

## Qué NO corrige, y por qué

Un dato clínico ausente no se puede deducir. Rellenarlo produciría un archivo
que el sistema acepta pero que reporta información falsa sobre una paciente.
Esos casos se listan en la pestaña **Revisión manual**:

- Documentos, diagnósticos CIE-10 o resultados de laboratorio en blanco.
- Resultados que se contradicen con el tipo de estudio declarado.

Tampoco se recalcula ningún dato clínico, ni siquiera cuando el propio archivo
dice cuál debería ser. Estos casos se **señalan con la respuesta ya calculada**,
pero no se aplican solos:

| Caso | Qué se sugiere |
|---|---|
| Grávida que no cuadra | La suma: partos + cesáreas + abortos + ectópicos + 1 |
| Falta la FPP, o es incoherente con la FUM | FUM + 280 días (regla de Naegele) |
| FUM imposible (más de 42 semanas de gestación) | La FUM que corresponde a la semana gestacional registrada |
| Tipo de caso vacío | El código `21`, que es «no tiene tipo de caso» |
| Prueba de VIH en el trimestre equivocado | A qué trimestre habría que pasar las cinco columnas |
| Dos controles del mismo profesional con idéntica fecha | Dejar vacío el duplicado |

La diferencia importa: son datos de una paciente, y quien decide es quien tiene
la historia clínica delante. En la tabla de campos por completar la sugerencia
viene escrita en la casilla; aplicarla es un clic, pero es **tu** clic.

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
│   │   ├── corrector.js       Orquestador y orden de lectura de fechas
│   │   ├── archivo.js         Lectura/escritura de CSV y nombre de salida
│   │   └── errores-sistema.js Cruce con el reporte de errores de la plataforma
│   │
│   └── ui/
│       ├── app.js             Asistente, tablas y descargas
│       ├── editor.js          Edición de una celda sin salir de la app
│       ├── errores.js         Pantalla del cruce con el reporte de la plataforma
│       ├── estilos.css
│       ├── logo-hospital.svg  Emblema institucional
│       └── LEEME-logo.md      Cómo usar el logo oficial
│
├── tests/
│   ├── instructivo.mjs        El esquema contra el Instructivo V5, campo a campo
│   ├── validar.mjs            Prueba de regresión contra el caso real
│   └── cobertura.mjs          Las 248 columnas con datos desordenados
│
├── datos-prueba/              (excluida de git — contiene datos reales)
└── docs/
    ├── Instructivo_SMH_V5.pdf Fuente normativa
    ├── instructivo-v5.json    La tabla del PDF extraída, contra la que se prueba
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

El cruce agrupa los errores por tipo y marca cada grupo con uno de tres estados,
junto al número de fila donde aparece:

| Estado | Qué significa |
|---|---|
| **Sigue abierto** | El corrector también señala esa celda: hay que resolverla |
| **Depende de otro campo** | La celda está limpia, pero el mensaje habla de otro campo de esa misma fila que sigue pendiente. No se puede dar por resuelto hasta decidir ese otro campo |
| **Ya resuelto** | Ni la celda ni los campos que cita el mensaje tienen nada pendiente |

**Importante: el cruce no verifica el archivo contra las reglas de la
plataforma**, porque esas reglas no están publicadas. Lo que hace es contrastar
cada error con lo que el corrector ve hoy en esa celda. «Ya resuelto» significa
«el corrector no encuentra nada que objetar aquí», no «la plataforma lo va a
aceptar». La palabra final la tiene el sistema de salud.

Si en ese reporte aparece un error de tipo «debe contener solo letras» sobre una
celda que hoy lleva ñ, es la prueba de que la plataforma no la acepta: SIRA lo
avisa y ofrece un botón para reemplazar la ñ por N en todo el archivo y volver a
descargarlo. Hasta que el sistema no lo demuestre, la ñ se respeta.

Sobre el caso real: de los 909 errores que devolvió la plataforma, el cruce
muestra 650 resueltos, 88 abiertos y 171 a la espera de otro campo, cada uno con
el mensaje textual del sistema.

Vale la pena ver por qué se resuelven tantos de golpe. La mayoría de los errores
del caso real no eran errores independientes: el archivo traía `"NO "` con un
espacio al final en campos como `se_realizo_ive` o `ecografia3_obstetrica`. La
plataforma no reconocía ese valor, así que además del error propio disparaba
todas las reglas condicionales que colgaban de él («el campo X debe estar
diligenciado cuando se_realizo_ive es SI»). Al quitar el espacio —una corrección
de formato, sin tocar el dato— se cae toda la cascada.

**2. Corrige en Excel y vuelve a subir.** Es el camino natural y funciona:

- Abre el archivo corregido en Excel y edita lo que haga falta.
- Guarda (Excel escribirá las fechas como `31/07/2026`, no importa).
- Vuelve a pasarlo por SIRA: las fechas se restauran a `2026-07-31`.

Está comprobado en las pruebas: un archivo corregido, editado y guardado en
Excel, al volver a pasarlo por SIRA queda **idéntico** al original corregido.

### Fechas `03/07/2026`: día/mes o mes/día

Una fecha con barras y los dos números menores que 13 es ambigua, y leerla al
revés cambia el dato sin que se note. SIRA no lo decide celda a celda: mira
**todas** las fechas del archivo y busca la que lo demuestre. Si alguna trae
`25/07/2026`, el primer número es el día y el archivo entero se lee así; si
alguna trae `07/25/2026`, es al revés (eso pasa cuando el CSV se guardó desde un
Excel en configuración regional inglesa).

Si ninguna fecha lo demuestra, se leen como día/mes —que es lo que escribe Excel
en español— y la app te lo avisa en pantalla, para que no dependa de una
suposición callada.

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

`npm run test:instructivo` contrasta los 248 campos contra la tabla del PDF y
las imprime una a una. Son siete, de dos clases distintas.

**El validador real contradice al documento** (manda el validador: el archivo
tiene que pasar por él, no por el PDF):

- **Urocultivo3 y Urocultivo_post3.** El instructivo pide `SI`/`NO` y los hace
  obligatorios. El reporte de la plataforma dice textualmente que solo admite
  `POSITIVO`, `NEGATIVO`, `INDETECTABLE` «y vacío en caso que no aplique».
- **Causa de muerte.** El instructivo la hace condicional a que la madre haya
  fallecido, pero el código `4` («la persona no ha fallecido») tiene que ir
  siempre. Se trata como obligatoria y el corrector rellena el `4`.
- **Longitud de los tipos de estudio de sífilis** (campos 111 y 127). Declara
  longitud 1, pero sus propios valores permitidos son `PRUEBA RAPIDA` y `VDRL`.

**Erratas del propio documento** (se aplica la lectura coherente con el resto
de la tabla):

- **Fecha de realización de la prueba vih3** (142). Dice que depende del
  resultado del trimestre **2**, pero es la fecha del trimestre 3 y su propia
  nota habla de vih3.
- **Alteración nutricional consulta1** (200). Dice que depende de *Control
  nutrición 2*, pero los campos vecinos siguen el patrón 1→1 y 2→2.

El PDF además numera dos campos distintos como el 87 (*Fecha htco* y *Frotis*);
el esquema va por posición, que es como vienen las columnas del archivo.

**Además**, y esto ya no es contradicción sino criterio:

- **Longitudes.** El instructivo declara longitud 2 para `riesgo`, que admite
  `ALTO`; para los urocultivos, que admiten `INDETECTABLE`; y para `hb`, que
  admite decimales. En esos 14 campos manda el catálogo o el rango.
- **Separador decimal del peso.** El instructivo pide coma, pero el archivo es
  un CSV separado por comas y la plataforma aceptó el punto sin observaciones.
- **Semana epidemiológica.** El instructivo la limita a 52, pero el calendario
  del INS tiene años de 53 semanas. Un valor de 53 se reporta para revisión.
