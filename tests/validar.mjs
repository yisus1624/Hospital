// Prueba de regresion contra el caso real.
//
// Toma el archivo que la plataforma rechazo (datos-prueba/PRUEBA.csv) junto con
// el reporte de errores que devolvio (datos-prueba/errores-del-sistema.csv), lo
// pasa por el corrector y comprueba dos cosas:
//
//   1. Que el corrector NO altera ningun dato: cada cambio es de formato o es
//      un codigo que el instructivo prescribe para una celda vacia.
//   2. Que lo que exige una decision humana queda señalado, en la fila y el
//      campo que reporto la plataforma.
//
// Uso:  node tests/validar.mjs

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { leerCSV, mapearColumnas, aCSV, nombreArchivo } from '../src/core/archivo.js';
import { procesar } from '../src/core/corrector.js';
import { normalizarCelda } from '../src/core/normalizar.js';
import { CAMPOS, POR_KEY } from '../src/core/esquema.js';
import { limpiar } from '../src/core/texto.js';
import { semanaEpidemiologica } from '../src/core/epidemiologia.js';
import { cruzar, detectarEnyeRechazada, leerReporteErrores, resumirCruce }
  from '../src/core/errores-sistema.js';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const leer = p => readFileSync(join(raiz, p), 'utf8');

const ok = s => `\x1b[32m${s}\x1b[0m`;
const mal = s => `\x1b[31m${s}\x1b[0m`;
const dim = s => `\x1b[90m${s}\x1b[0m`;

let fallos = 0;
function comprobar(condicion, titulo, detalle = '') {
  console.log(`${condicion ? ok('  OK  ') : mal(' FALLA')}  ${titulo}${detalle ? dim(' — ' + detalle) : ''}`);
  if (!condicion) fallos++;
}

// ---------------------------------------------------------------------------

console.log('\n== Esquema ==');
comprobar(CAMPOS.length === 248, 'El esquema tiene 248 campos', `tiene ${CAMPOS.length}`);
comprobar(new Set(CAMPOS.map(c => c.col)).size === 248, 'No hay nombres de columna repetidos');
comprobar(CAMPOS.every((c, i) => c.num === i + 1), 'La numeracion va de 1 a 248 sin saltos');

// ---------------------------------------------------------------------------

console.log('\n== Calendario epidemiologico ==');
// Casos de control del estandar MMWR (semanas de domingo a sabado).
for (const [fecha, esperada, anioEsp] of [
  ['2021-01-02', 53, 2020],
  ['2021-01-03', 1, 2021],
  ['2024-12-28', 52, 2024],
  ['2020-12-31', 53, 2020],
  ['2026-01-03', 53, 2025],
  ['2026-01-04', 1, 2026],
]) {
  const r = semanaEpidemiologica(fecha);
  comprobar(r.semana === esperada && r.anio === anioEsp,
    `${fecha} cae en la semana ${esperada} de ${anioEsp}`,
    `calculado S${r.semana} de ${r.anio}`);
}

// ---------------------------------------------------------------------------

console.log('\n== Lectura del archivo rechazado ==');
const registros = leerCSV(leer('datos-prueba/PRUEBA.csv'));
comprobar(registros.length === 18, 'Se leen los 18 registros', `leidos ${registros.length}`);

const { filas: brutas, aviso } = mapearColumnas(registros);
comprobar(aviso === null, 'Los encabezados coinciden con los nombres oficiales', aviso || '');

// ---------------------------------------------------------------------------

console.log('\n== Correccion ==');
const r = procesar(brutas);
console.log(dim(`        ${r.resumen.correcciones} correcciones aplicadas, ` +
  `${r.resumen.pendientes} pendientes en ${r.resumen.filasConPendientes} filas`));

// ---------------------------------------------------------------------------
// Garantia principal: ningun dato se altera.
// ---------------------------------------------------------------------------

console.log('\n== Ningun dato se altera ==');

const porCol = Object.fromEntries(CAMPOS.map(c => [c.col, c]));
const NA_FECHA = '1845-01-01';
const EQUIV_SIFILIS = new Set(['POSITIVO>REACTIVO', 'NEGATIVO>NO REACTIVO',
  'REACTIVO>POSITIVO', 'NO REACTIVO>NEGATIVO']);

const sinExplicar = r.cambios.filter(c => {
  if (c.tipo === 'formato') {
    // Volver a normalizar el valor original debe dar exactamente el nuevo:
    // es la misma informacion, solo reescrita.
    if (normalizarCelda(c.antes, porCol[c.campo]).valor === c.despues) return false;
    return !EQUIV_SIFILIS.has(`${c.antes}>${c.despues}`);
  }
  if (c.tipo === 'instructivo') {
    // Solo se llena una celda vacia, o se retira la centinela "no aplica".
    return !(c.antes === '' || (c.antes === NA_FECHA && c.despues === ''));
  }
  if (c.tipo === 'vaciado') {
    // La celda sale vacia solo si el valor no era interpretable. Si volver a
    // normalizarlo diera algo, el vaciado no estaria justificado.
    return normalizarCelda(c.antes, porCol[c.campo]).valor !== null || c.despues !== '';
  }
  return true;
});
comprobar(sinExplicar.length === 0,
  'Cada cambio es de formato o un codigo del instructivo en una celda vacia',
  sinExplicar.slice(0, 3).map(c => `fila ${c.fila} ${c.campo}: "${c.antes}" -> "${c.despues}"`).join(' | '));

comprobar(r.cambios.every(c => c.tipo === 'vaciado' || c.antes === '' || c.despues !== '' ||
  c.antes === NA_FECHA || normalizarCelda(c.antes, porCol[c.campo]).valor === ''),
  'Ninguna celda con dato real se vacia sin declararlo');

// Las unicas celdas con dato que salen vacias son las de valor no interpretable,
// y cada una tiene que estar en los dos reportes: en el de correcciones (para
// que se vea que la celda quedo vacia) y en el de revision manual con su valor
// original (para que el dato no se pierda).
const vaciadasReales = [];
brutas.forEach((b, i) => {
  for (const c of CAMPOS) {
    const antes = String(b[c.col] ?? '');
    if (limpiar(antes) !== '' && String(r.filas[i][c.key] ?? '') === '') {
      vaciadasReales.push({ fila: i + 2, campo: c.col, antes });
    }
  }
});
const enCambios = new Set(r.cambios.map(c => `${c.fila}|${c.campo}`));
const enPendientes = new Map(r.pendientes.map(p => [`${p.fila}|${p.campo}`, p]));
const sinRastro = vaciadasReales.filter(v => !enCambios.has(`${v.fila}|${v.campo}`));
comprobar(sinRastro.length === 0,
  'Toda celda que sale vacia aparece en el reporte de correcciones',
  `${vaciadasReales.length} celdas vaciadas` +
  (sinRastro.length ? ` — sin registrar: ${sinRastro.slice(0, 3).map(v => `fila ${v.fila} ${v.campo}`).join(', ')}` : ''));

const invalidas = r.cambios.filter(c => c.tipo === 'vaciado');
comprobar(invalidas.every(c => enPendientes.get(`${c.fila}|${c.campo}`)?.valor === c.antes),
  'El valor original de cada celda vaciada queda en la revision manual');

comprobar(r.cambios.filter(c => c.motivo.startsWith('Espacios sobrantes'))
  .every(c => limpiar(c.antes) === c.despues),
  'Lo que se reporta como "espacios sobrantes" no esconde un cambio de valor');

/** Valor original de una celda, ya normalizado (sin cambiar su contenido). */
const original = (i, key) => normalizarCelda(brutas[i][POR_KEY[key].col], POR_KEY[key]).valor;

for (const key of ['fum', 'fpp', 'gravida', 'tipo_caso', 'diag3', 'control_psicologia2',
  'fecha_prueba_vih1', 'fecha_prueba_vih2', 'malformaciones']) {
  comprobar(r.filas.every((f, i) => f[key] === original(i, key)),
    `${POR_KEY[key].nombre}: queda tal como vino`);
}

const celdas = r.pendientes.map(p => `${p.fila}|${p.campo}`);
comprobar(new Set(celdas).size === celdas.length,
  'Cada celda aparece una sola vez en la revision manual');

// ---------------------------------------------------------------------------
// Lo que exige decision humana queda señalado donde lo marco la plataforma.
// ---------------------------------------------------------------------------

console.log('\n== Errores devueltos por la plataforma ==');
const errores = leerCSV(leer('datos-prueba/errores-del-sistema.csv'));
console.log(dim(`        ${errores.length} errores en el reporte original`));

const pendiente = new Set(r.pendientes.map(p => `${p.fila}|${p.campo}`));
const senalados = errores.filter(e => pendiente.has(`${+e.identificador}|${e.campo}`));

// El cruce no verifica el archivo contra las reglas de la plataforma (no estan
// publicadas): contrasta cada error con lo que el corrector ve hoy en esa
// celda. Por eso hay tres estados, y "dependiente" es el que evita cantar
// victoria sobre un error cuya causa sigue sin decidir.
const cruceCompleto = cruzar(
  leerReporteErrores(leer('datos-prueba/errores-del-sistema.csv')).errores,
  r.filas, r.pendientes);
const res = resumirCruce(cruceCompleto);
console.log(dim(`        ${res.corregidos} resueltos con formato o codigos del instructivo, ` +
  `${res.pendientes} señalados para revision manual, ` +
  `${res.dependientes} a la espera de otro campo`));

comprobar(res.corregidos + res.pendientes + res.dependientes + res.desconocidos === res.total,
  'Cada error del reporte queda clasificado en un solo estado');

// Un error sobre un campo cuya causa es otro campo todavia pendiente no se
// puede dar por resuelto. El caso real: los nueve campos de seguimiento
// dependen del tipo de caso, que sigue sin decidir.
const segSinTipo = cruceCompleto.filter(c =>
  c.campoBruto.startsWith('seguimiento_') && c.estado === 'corregido');
comprobar(segSinTipo.length === 0,
  'Los campos de seguimiento no se dan por resueltos mientras el tipo de caso este pendiente',
  `${cruceCompleto.filter(c => c.estado === 'dependiente').length} errores marcados como dependientes`);

// Errores cuya solucion es un dato que solo conoce quien atendio a la gestante.
for (const campo of ['gravida', 'control_psicologia2', 'fecha_de_realizacion_de_la_prueba_vih_1',
  'tipo_de_caso', 'malformaciones_congenitas_en_la_gestacion',
  'gestante_antecedentes_preeclampsia', 'fum', 'fpp']) {
  const suyos = errores.filter(e => e.campo === campo);
  const vistos = suyos.filter(e => pendiente.has(`${+e.identificador}|${e.campo}`));
  comprobar(suyos.length > 0 && vistos.length === suyos.length,
    `${campo}: los ${suyos.length} errores quedan señalados en su fila`);
}

const conSugerencia = key => r.pendientes.filter(p => p.campo === POR_KEY[key].col);
comprobar(conSugerencia('gravida').every(p => p.sugerido !== undefined),
  'La grávida que no cuadra trae la suma como sugerencia');
comprobar(conSugerencia('tipo_caso').every(p => p.sugerido === '21'),
  'El tipo de caso vacio sugiere 21, sin aplicarlo');

// ---------------------------------------------------------------------------

console.log('\n== Salida ==');
const { nombre, avisos } = nombreArchivo(r.filas);
comprobar(/^\d{9}_\d{4}_\d{2}_S\d{2}\.csv$/.test(nombre),
  `Nombre con la estructura NIT_AAAA_MM_Snn`, nombre);
comprobar(nombre === '800193912_2026_07_S30.csv',
  'NIT de 9 digitos y semana tomada del dato',
  'el archivo rechazado decia 8000193912_..._S32 (NIT de 10 digitos y semana 32 en vez de 30)');
for (const a of avisos) console.log(dim(`        aviso: ${a}`));

const csv = aCSV(r.filas);
const lineas = csv.trim().split('\r\n');
comprobar(lineas.length === 19, 'El CSV trae encabezado + 18 registros', `${lineas.length} lineas`);
comprobar(lineas.every(l => l.split(',').length === 248),
  'Todas las lineas tienen 248 columnas');
comprobar(!/, | ,|^ | $/m.test(csv.replace(/"[^"]*"/g, '')),
  'Ningun valor queda con espacios al inicio o al final');

// Comprobaciones puntuales sobre las reglas del instructivo
console.log('\n== Reglas del instructivo ==');
comprobar(r.filas.every(f => f.riesgo === 'ALTO' || f.riesgo === 'BAJO'),
  'riesgo queda dentro del catalogo ALTO/BAJO');
comprobar(r.filas.every(f => f.chagas !== 'NO SE REALIZA TAMIZAJE' || f.fecha_chagas === '1845-01-01'),
  'Sin tamizaje de Chagas, la fecha es 1845-01-01');
comprobar(r.filas.every(f => f.vitalidad_madre !== '3' || f.causa_muerte === '4'),
  'Si la madre no fallecio, la causa de muerte es 4');
comprobar(r.filas.every(f => f.sifilis_confirmada !== 'NO' || f.tratamiento_sifilis === '4'),
  'Sin sifilis confirmada, el tratamiento es 4 (NA)');
comprobar(r.filas.every(f => f.ecografia3 !== 'NO' || f.anormalidades_eco3 === ''),
  'Con ecografia3 en NO, las anormalidades quedan vacias');
// La enye se conserva: CAÑAS es un apellido distinto de CANAS y de CAAS.
comprobar(!/[^\x00-\x7FÑñ]/.test(csv),
  'La salida no trae tildes ni caracteres raros, solo la enye');
comprobar(r.filas.some(f => f.apellido1 === 'CAÑAS'),
  'El apellido CAÑAS conserva la enye', 'antes salia CAAS');

// Cuando la plataforma la rechaza, el reporte de errores ofrece el reemplazo.
const rN = procesar(brutas, { enyeComoN: true });
comprobar(rN.filas.some(f => f.apellido1 === 'CANAS'),
  'Con enyeComoN activo, CAÑAS pasa a CANAS');
comprobar(!/[^\x00-\x7F]/.test(aCSV(rN.filas)),
  'Con enyeComoN activo la salida es ASCII puro');

// El detector solo se dispara con la evidencia del propio sistema.
const cruceEnye = cruzar(
  [{ fila: 7, campoBruto: 'apellido_1', campo: POR_KEY.apellido1,
     mensaje: 'El campo apellido 1 debe contener solo letras' }],
  r.filas, r.pendientes);
comprobar(detectarEnyeRechazada(cruceEnye).detectada,
  'Se detecta que la plataforma rechazo la enye');
comprobar(!detectarEnyeRechazada(cruzar(
  [{ fila: 3, campoBruto: 'apellido_1', campo: POR_KEY.apellido1,
     mensaje: 'El campo apellido 1 debe contener solo letras' }],
  r.filas, r.pendientes)).detectada,
  'No se dispara en una fila sin enye');

// ---------------------------------------------------------------------------

console.log(fallos === 0
  ? ok(`\n${'='.repeat(60)}\nTodas las comprobaciones pasaron.\n`)
  : mal(`\n${'='.repeat(60)}\n${fallos} comprobacion(es) fallaron.\n`));

process.exit(fallos === 0 ? 0 : 1);
