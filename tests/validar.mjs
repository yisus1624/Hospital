// Prueba de regresion contra el caso real.
//
// Toma el archivo que la plataforma rechazo (datos-prueba/PRUEBA.csv) junto con
// el reporte de errores que devolvio (datos-prueba/errores-del-sistema.csv), lo
// pasa por el corrector y comprueba que cada error reportado quede resuelto.
//
// Uso:  node tests/validar.mjs

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { leerCSV, mapearColumnas, aCSV, nombreArchivo } from '../src/core/archivo.js';
import { procesar } from '../src/core/corrector.js';
import { CAMPOS, POR_KEY } from '../src/core/esquema.js';
import { semanaEpidemiologica } from '../src/core/epidemiologia.js';
import { cruzar, detectarEnyeRechazada } from '../src/core/errores-sistema.js';

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
// Cada error que devolvio el sistema debe estar resuelto o justificado.
// ---------------------------------------------------------------------------

console.log('\n== Errores devueltos por la plataforma ==');
const errores = leerCSV(leer('datos-prueba/errores-del-sistema.csv'));
console.log(dim(`        ${errores.length} errores en el reporte original`));

// Campos que siguen sin dato tras corregir, por fila (1-indexada).
const pendientePorFila = new Map();
for (const p of r.pendientes) {
  if (!pendientePorFila.has(p.fila)) pendientePorFila.set(p.fila, new Set());
  pendientePorFila.get(p.fila).add(p.campo);
}

const porCampo = new Map();
for (const e of errores) {
  const campo = e.campo;
  const fila = +e.identificador;
  if (!porCampo.has(campo)) porCampo.set(campo, { total: 0, sinResolver: 0 });
  const acc = porCampo.get(campo);
  acc.total++;
  if (pendientePorFila.get(fila)?.has(campo)) acc.sinResolver++;
}

let resueltos = 0, sinResolver = 0;
const pendientesPorCampo = [];
for (const [campo, acc] of porCampo) {
  resueltos += acc.total - acc.sinResolver;
  sinResolver += acc.sinResolver;
  if (acc.sinResolver) pendientesPorCampo.push([campo, acc.sinResolver, acc.total]);
}

const pct = (resueltos / errores.length * 100).toFixed(1);
comprobar(sinResolver < errores.length * 0.05,
  `Se resuelven ${resueltos} de ${errores.length} errores (${pct}%)`,
  sinResolver ? `${sinResolver} requieren dato clinico` : '');

if (pendientesPorCampo.length) {
  console.log(dim('\n        Requieren intervencion manual (dato ausente en el archivo):'));
  for (const [campo, n, total] of pendientesPorCampo.sort((a, b) => b[1] - a[1])) {
    console.log(dim(`          ${String(n).padStart(3)}/${total}  ${campo}`));
  }
}

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

// Comprobaciones puntuales sobre las reglas mas delicadas
console.log('\n== Reglas clave ==');
const f1 = r.filas[0];
comprobar(r.filas.every(f => f.riesgo === 'ALTO' || f.riesgo === 'BAJO'),
  'riesgo queda dentro del catalogo ALTO/BAJO');
comprobar(r.filas.every(f => f.tipo_caso !== ''),
  'tipo_de_caso nunca queda vacio');
comprobar(r.filas.every(f => f.fecha_chagas !== ''),
  'fecha_de_identificacion_gestante_con_chagas se completa');
comprobar(r.filas.every(f => f.chagas !== 'NO SE REALIZA TAMIZAJE' || f.fecha_chagas === '1845-01-01'),
  'Sin tamizaje de Chagas, la fecha es 1845-01-01');
comprobar(r.filas.every(f => f.causa_muerte !== ''),
  'causa_de_muerte se completa segun la vitalidad de la madre');
comprobar(r.filas.every(f => f.vitalidad_madre !== '3' || f.causa_muerte === '4'),
  'Si la madre no fallecio, la causa de muerte es 4');
comprobar(r.filas.every(f => f.sifilis_confirmada !== 'NO' || f.tratamiento_sifilis === '4'),
  'Sin sifilis confirmada, el tratamiento es 4 (NA)');
comprobar(r.filas.every(f => f.ecografia3 !== 'NO' || f.anormalidades_eco3 === ''),
  'Con ecografia3 en NO, las anormalidades quedan vacias');
comprobar(r.filas.every(f => {
  const suma = ['partos', 'cesareas', 'abortos', 'ectopicos']
    .reduce((a, k) => a + (+f[k] || 0), 0) + 1;
  return +f.gravida === suma;
}), 'grabida = partos+cesareas+abortos+ectopicos+1 en todas las filas');
comprobar(r.filas.every(f => {
  const d = (Date.parse(f.fpp) - Date.parse(f.fum)) / 86400000;
  return d > 0 && d <= 294;
}), 'La FPP cae entre la FUM y 42 semanas despues');
// La enye se conserva: CAÑAS es un apellido distinto de CANAS y de CAAS.
comprobar(!/[^\x00-\x7FÑñ]/.test(csv),
  'La salida no trae tildes ni caracteres raros, solo la enye');
comprobar(r.filas.some(f => f.apellido1 === 'CAÑAS'),
  'El apellido CAÑAS conserva la enye', 'antes salia CAAS');

// Cuando la plataforma la rechaza, el reporte de errores activa el reemplazo.
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
